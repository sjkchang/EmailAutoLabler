import { Module, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RuleModule } from './rule/rule.module';
import { UserServiceMiddleware } from './user/user.service';
import { EmailModule } from './email/email.module';
import { OpenAIModule } from './openai/openai.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://sjkchang:mongopassword@autolabeler.qvmhw.mongodb.net/?retryWrites=true&w=majority&appName=AutoLabeler`,
    ),
    ConfigModule.forRoot(),
    UserModule,
    RuleModule,
    EmailModule,
    OpenAIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserServiceMiddleware).forRoutes('*');
  }
}
