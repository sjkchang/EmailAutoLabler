import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  EmailClassificationRequest,
  EmailClassificationRequestDocument,
} from 'src/schemas/email.schema';
import { Model } from 'mongoose';
import { format, sub } from 'date-fns'; // Utility for date formatting
import { OpenAIService } from 'src/openai/openai.service';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(EmailClassificationRequest.name)
    private emailModel: Model<EmailClassificationRequest>,
    private readonly openAiService: OpenAIService,
    private readonly httpService: HttpService,
  ) {}

  async getMyLabels(user: UserDocument): Promise<[string, string][]> {
    // Fetch the user's email labels from the Gmail API
    // and return them to the client
    const response = await lastValueFrom(
      this.httpService.get(
        'https://gmail.googleapis.com/gmail/v1/users/me/labels',
        {
          headers: { Authorization: `Bearer ${user.googleOauthToken}` },
        },
      ),
    );

    // Extract the label names from the response
    return response.data.labels.map((label) => [label.id, label.name]);
  }

  async createLabel(
    user: UserDocument,
    labelName: string,
  ): Promise<[string, string]> {
    console.log(user.googleOauthToken);
    const response = await lastValueFrom(
      this.httpService.post(
        'https://gmail.googleapis.com/gmail/v1/users/me/labels',
        {
          name: labelName,
          messageListVisibility: 'show',
          labelListVisibility: 'labelShow',
        },
        {
          headers: { Authorization: `Bearer ${user.googleOauthToken}` },
        },
      ),
    );

    console.log(response.data);

    return [response.data.id, response.data.name];
  }

  async fetchNewEmails(
    user: UserDocument,
  ): Promise<EmailClassificationRequest[]> {
    const lastFetchedEmailDatetime =
      user.lastFetchedEmailDatetime || new Date(0);

    const formattedLastEmailDateTime = format(
      new Date(lastFetchedEmailDatetime),
      'MM/dd/yyyy',
    );

    const query = `after:${formattedLastEmailDateTime}`;
    const emailIds: string[] = [];
    let nextPageToken: string | undefined;

    do {
      const response = await lastValueFrom(
        this.httpService.get(
          'https://gmail.googleapis.com/gmail/v1/users/me/messages',
          {
            headers: { Authorization: `Bearer ${user.googleOauthToken}` },
            params: { q: query, pageToken: nextPageToken, maxResults: 100 },
          },
        ),
      );

      const messages = response.data.messages || [];
      emailIds.push(...messages.map((message: any) => message.id));
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    // Update the user's lastEmailDateTime in the database to now
    user.lastFetchedEmailDatetime = new Date();
    await user.save();

    let emailClassificationRequests: EmailClassificationRequest[] = [];
    try {
      // Create EmailClassificationRequest documents for each email and save them to the database
      emailClassificationRequests = await Promise.all(
        emailIds.map((emailId) => {
          const email = new this.emailModel({
            owner: user._id,
            emailId,
            status: 'incomplete',
          });

          return email.save();
        }),
      );
    } catch (error) {}

    // Return a list of EmailClassificationRequest documents to the client
    return emailClassificationRequests;
  }

  async getFullEmailContent(
    user: UserDocument,
    email: EmailClassificationRequestDocument,
  ): Promise<EmailClassificationRequestDocument> {
    // Fetch the content of the email with the given ID from the Gmail API
    const response = await lastValueFrom(
      this.httpService.get(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${email.emailId}`,
        {
          headers: { Authorization: `Bearer ${user.googleOauthToken}` },
        },
      ),
    );

    const payload = response.data.payload;

    // Extract subject from payload.headers
    const subject = payload.headers.find(
      (header: any) => header.name === 'Subject',
    ).value;

    // Extract the body of the email
    let body: string;
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain') {
        body = Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
    }

    if (body && subject) {
      // Update the email document with the content
      email.content = `Subject: ${subject} Content: ${body}`;
      email.status = 'unprocessed';
      return email.save();
    }

    return email;
  }

  async getFullEmailContents(user: UserDocument): Promise<void> {
    // Get the incomplete emails from the database
    const unprocessedEmails = await this.emailModel.find({
      owner: user._id,
      status: 'incomplete',
    });

    // For each incomplete email get the content:
    await Promise.all(
      unprocessedEmails.map((email) => {
        return this.getFullEmailContent(user, email);
      }),
    );
  }

  async categorizeEmail(
    email: EmailClassificationRequestDocument,
    rules: string[],
  ) {
    // Categorize the email using the OpenAI API
    // Update the email document with the associated labels
    rules = [
      `Is this email related to a Job Application? If so include the label "Job Application" and a label representing the company.`,
      `Is this email a application Rejection? If so include the label "Rejection".`,
    ];

    let prompt = `You have been provided with the content of an email. Using the following list of rules
    and their associated labels, determine what labels, if any should be applied to this email. Your 
    response should come in the format of a comma seperated list of labels:
    If no labels apply, simply respond with "None".
    Rules:
    `;
    rules.forEach((rule) => {
      prompt += `- ${rule}\n`;
    });
    prompt += `Email Content: ${email.content}`;

    const messages = [];
    const gptResponse = await this.openAiService.chatGptRequest(
      prompt,
      messages,
    );

    const categorizedLabels = gptResponse
      .split(',')
      .map((label) => label.trim());

    // Update the email document
    email.associated_labels = [
      ...email.associated_labels,
      ...categorizedLabels,
    ];
    email.status = 'categorized';
    email.save();
  }

  async categorizeEmails(user: UserDocument) {
    // Get the uncategorized emails from the database
    const uncategorizedEmails = await this.emailModel.find({
      owner: user._id,
      status: 'unprocessed',
    });

    // For each uncategorized email, categorize it
    for (const email of uncategorizedEmails) {
      this.categorizeEmail(email, []);
    }
  }

  async labelEmails(user: UserDocument) {
    let usersLabels = await this.getMyLabels(user);

    // Get emails with status 'categorized' from the database
    const categorizedEmails = await this.emailModel.find({
      owner: user._id,
      status: 'categorized',
    });

    // For each categorized email, apply the labels
    for (const email of categorizedEmails) {
      const labelIds: string[] = []; // Collect the label IDs for this email

      // Check if the label exists in usersLabels
      for (const label of email.associated_labels) {
        let labelId = usersLabels.find(([id, name]) => name === label)?.[0];

        // If the label does not exist, create it
        if (!labelId && label !== 'None') {
          const newLabel = await this.createLabel(user, label); // newLabel is [id, name]
          usersLabels.push(newLabel); // Add the new label to the list
          labelId = newLabel[0]; // Use the ID of the newly created label
        }

        if (labelId) {
          labelIds.push(labelId); // Add the ID to the labelIds array
        }
      }

      // Apply the label IDs to the email in the user's email client
      if (labelIds.length > 0) {
        //Apply the labels to the email in the user's email client
        await lastValueFrom(
          this.httpService.post(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${email.emailId}/modify`,
            {
              addLabelIds: labelIds,
            },
            {
              headers: { Authorization: `Bearer ${user.googleOauthToken}` },
            },
          ),
        );

        // Update the email status to 'labeled'
        await this.emailModel.updateOne(
          { _id: email._id },
          { status: 'labeled' },
        );
      }
    }
  }
}
