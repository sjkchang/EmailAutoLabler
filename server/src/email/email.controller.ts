import { Controller, Get, Post } from '@nestjs/common';

import { CurrentUser } from 'src/user/user.decorator';
import { User, UserDocument } from 'src/schemas/user.schema';
import { EmailService } from './email.service';
import { CategorizeEmailDto } from './dto/categorize-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('labels')
  async getMyLabels(@CurrentUser() user: UserDocument): Promise<any> {
    return this.emailService.getMyLabels(user);
  }

  @Post('label')
  async label(@CurrentUser() user: UserDocument): Promise<any> {
    await this.emailService.fetchNewEmails(user);
    await this.emailService.getFullEmailContents(user);
    await this.emailService.categorizeEmails(user);
    await this.emailService.labelEmails(user);
  }
}
