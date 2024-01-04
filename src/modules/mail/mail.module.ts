/* eslint-disable prettier/prettier */

import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from 'src/services/email.service';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                service: 'gmail',
                // port:465,
                // secure:false,
                // logger:true,
                // debug:true,
                // secureConnection:false,
                // tls:{
                //     rejectUnAuthorized:true
                // }
                auth: {
                    user: process.env.MAILED_BY,
                    pass: process.env.MAIL_PASS_KEY,
                },
            },
            defaults: {
                from: process.env.MAILED_BY,
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
