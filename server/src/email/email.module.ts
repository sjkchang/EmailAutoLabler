import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmailClassificationRequest,
  EmailClassificationRequestSchema,
} from 'src/schemas/email.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: EmailClassificationRequest.name,
        schema: EmailClassificationRequestSchema,
      },
    ]),
  ],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}