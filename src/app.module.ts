/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';
import { SequelizeConfig } from './database/database.providers';
import { BrowserMiddleware } from './Middlewares/browser.middleware';
import { HostMiddleware } from './Middlewares/host.middleware';
import { ProtocolMiddleware } from './Middlewares/protocol.middleware';
import { TokenMiddleware } from './Middlewares/token.middleware';
import { MailService } from './services/email.service';
import { MailModule } from './modules/mail/mail.module';
import { RecordModule } from './modules/recorded/record.module';
import { AgentMiddleware } from './Middlewares/agent.middleware';

@Module({
  imports: [
    SequelizeModule.forRoot({ ...SequelizeConfig }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.sample'],
    }),
    DatabaseModule,
    AuthModule,
    PostsModule,
    UsersModule,
    MailModule,
    RecordModule
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      HostMiddleware,
      BrowserMiddleware,
      ProtocolMiddleware,
      AgentMiddleware
    ).forRoutes('*')
    consumer.apply(TokenMiddleware).exclude(
      { path: 'auth/login', method: RequestMethod.POST },
      { path: 'auth/signup', method: RequestMethod.POST },
      { path: 'auth/logout', method: RequestMethod.POST },
      { path: 'auth/forgot_pass', method: RequestMethod.POST },
      { path: 'auth/mailtoresetpass', method: RequestMethod.POST },
      { path: 'auth/reset-password', method: RequestMethod.GET },
      { path: 'auth/forgot-password', method: RequestMethod.POST },
      { path: 'auth/mail-login-otp', method: RequestMethod.POST },
      { path: 'auth/account-verification', method: RequestMethod.GET },
      { path: 'auth/verify-me', method: RequestMethod.POST },
      { path: 'posts', method: RequestMethod.GET },


    ).forRoutes('*');

  };
}

