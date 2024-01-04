/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocationService } from 'src/services/country.service';
import { LocationGuard } from 'src/guards/Location/location.guard';
import { HttpModule } from '@nestjs/axios';
import { MailModule } from '../mail/mail.module';
import { RecordService } from '../recorded/record.service';
import { RecordModule } from '../recorded/record.module';
import { RECORD_REPOSITORY } from 'src/constants';
import { Record } from '../recorded/record.table';

@Module({
    imports: [
        PassportModule,
        UsersModule,
        JwtModule.register({
            secret: process.env.JWTKEY,
            signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
        }),
        HttpModule,
        MailModule,
        RecordModule
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        LocationService,
        LocationGuard,
        RecordService,
        {
            provide: RECORD_REPOSITORY,
            useValue: Record
        }

    ],
    controllers: [AuthController],
    exports: [
        LocationService,
        AuthService
    ],
})
export class AuthModule { }
