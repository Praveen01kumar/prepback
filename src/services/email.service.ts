/* eslint-disable prettier/prettier */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/user.table';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendUserConfirmation(user: User, token: string) {
    const url = `http://localhost:3000/auth/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: user?.email,
      //from: process.env.MAILED_BY,
      //template: templatePath,
      subject: 'Reset Your Prep Account Password: Action Required!',
      context: {
        name: user?.email,
        url,
      },
      html: `<!DOCTYPE html>
      <html lang="en">               
      <body>
        <style>
         body {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
          }
          .link_mail {
              background-color: #00f1ff52;
              display: flex;
              justify-content: center;
          }
          .link_mail_box {
              box-shadow: 7px 3px 36px 2px rgb(0 0 0 / 23%);
              margin: 20px;
              padding: 20px 4%;
              border-radius: 10px;
              font-size: 18px;
              width: 90%;
              background-color: #fff;
          }
          .link_mail_head {
              font-size: 30px;
              font-weight: 600;
              color: #007270;
              border-bottom: 1px solid grey;
              padding: 16px 0px;
              margin-bottom: 16px;
          }
          .link_he {
              margin-bottom: 16px;
          }
          .link_he span {
              font-weight: 600;
              color: green;
          }
          .link_btn {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 12px;
          }
          .link_btn button {
              border: none;
              background-color: #02dbd7;
              border-radius: 8px;
              width: 50%;
          }
          .link_btn button a {
              display: flex;
              padding: 4px 0px;
              text-align: center;
              justify-content: center;
              text-decoration: none;
              font-size: 20px;
              font-weight: 600;
              color: #fff;
          }
          .link_is_valid {
              background: #ff000042;
              width: 36%;
              margin: 10px auto;
              color: #fff;
              font-size: 12px;
              font-weight: 700;
              border-radius: 10px;
          }
        </style>
        <div class="link_mail">
        <div class="link_mail_box">
        <div class="link_mail_head">PrepAngular</div>
        <div class="link_he">Hello, <span>${user?.first_name}</span></div>
        <div>
            <p class="link_he">We've received a request to reset the password for the Prep account
                associated with
                ${user?.email}. No changes have been made to your account yet.
            </p>
            <p class="link_he">You can reset your password by clicking the link below:</p>
        </div>
        <div class="link_btn">
            <button><a href="${url}" target="_blank">Reset your password</a></button>
        </div>
        <div style="text-align: center;">
            <p class="link_is_valid">link is valid for 10 minutes only!</p>
        </div>
        <div>
            <p class="link_he">If you did not request a new password, please let us know immediately by
                replying to this email.</p>
        </div>
        <div>
            <p class="link_he">You can find answers to most questions and get in touch with us at
                <span style="cursor: pointer; color: blue;">support.prep.com.</span>
                We're here to help you at any step along the way.
            </p>
        </div>
        <div>
            <p class="link_he">--The Prep Anglular Team!</p>
        </div>
        <div style="border-top: 1px solid grey;">
            <span style="font-size: 12px;">Mohali 7 Phase Sector 61 Sahibzada Ajit Singh Nagar, Punjab 160062</span>
        </div>
        </div>
        </div>
      </body>                
      </html>`,
    });
  }

  async sendLoginOTP(user: User, otp: string) {
    await this.mailerService.sendMail({
      to: user?.email,
      //from: process.env.MAILED_BY,
      //template: templatePath,
      subject: 'Your Prep Account: Secure Login OTP Inside!',
      context: {
        name: user?.email,
        otp,
      },
      html: `<!DOCTYPE html>
      <html lang="en">               
      <style>
      body {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
      }
      .link_mail {
        background-color: #00f1ff52;
        display: flex;
        justify-content: center;
    }
    .link_mail_box {
        box-shadow: 7px 3px 36px 2px rgb(0 0 0 / 23%);
        margin: 20px;
        padding: 20px 4%;
        border-radius: 10px;
        font-size: 18px;
        width: 90%;
        background-color: #fff;
    }
    .link_mail_head {
        font-size: 30px;
        font-weight: 600;
        color: #007270;
        border-bottom: 1px solid grey;
        padding: 16px 0px;
        margin-bottom: 16px;
    }
    .link_he {
        margin-bottom: 16px;
    }
    .link_he span {
        font-weight: 600;
        color: green;
    }
    .link_btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
    }
    .link_btn button{
      border: none;
      background-color: rgb(2, 219, 215);
      border-radius: 8px;
      width: 50%;
      outline: none;
      color: #fff;
      cursor: auto;
    }
    .link_is_valid{
          background: #ff000042; 
          width: 36%; 
          margin: 10px auto;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          border-radius: 10px;
      }
      </style>
      <div class="link_mail">
        <div class="link_mail_box">
            <div class="link_mail_head">PrepAngular</div>
            <div class="link_he">Hello, <span>${user?.first_name}</span></div>
            <div>
                <p class="link_he">We've received a request to Login for the Prep account
                    associated with
                    ${user?.email}. No changes have been made to your account yet.
                </p>
                <p class="link_he">You can login in prep account by using the OTP below:</p>
            </div>
            <div class="link_btn">
                <button>${otp}</button>
            </div>
            <div style="text-align: center;">
                <p class="link_is_valid">OTP is valid for 10 minutes only!</p>
            </div>
            <div>
                <p class="link_he">If you did not request for otp, please let us know immediately by
                    replying to this email.</p>
            </div>
            <div>
                <p class="link_he">You can find answers to most questions and get in touch with us at
                    <span style="cursor: pointer; color: blue;">support.prep.com.</span>
                    We're here to help you at any step along the way.
                </p>
            </div>
            <div>
                <p class="link_he">--The Prep Anglular Team!</p>
            </div>
            <div style="border-top: 1px solid grey;">
                <span style="font-size: 12px;">Mohali 7 Phase Sector 61 Sahibzada Ajit Singh Nagar, Punjab 160062</span>
            </div>
        </div>
      </div>
      </body>                
      </html>`,
    });
  }

  async accountVerification(user: User, token: string) {
    const url = `http://localhost:3000/auth/account-verification?token=${token}`;
    await this.mailerService.sendMail({
      to: user?.email,
      //from: process.env.MAILED_BY,
      //template: templatePath,
      subject: 'Congratulations on Registering with Us! Verify Your Account Now!',
      context: {
        name: user?.email,
        url,
      },
      html: `<!DOCTYPE html>
      <html lang="en">               
      <body>
        <style>
         body {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
          }
          .link_mail {
              background-color: #00f1ff52;
              display: flex;
              justify-content: center;
          }
          .link_mail_box {
              box-shadow: 7px 3px 36px 2px rgb(0 0 0 / 23%);
              margin: 20px;
              padding: 20px 4%;
              border-radius: 10px;
              font-size: 18px;
              width: 90%;
              background-color: #fff;
          }
          .link_mail_head {
              font-size: 30px;
              font-weight: 600;
              color: #007270;
              border-bottom: 1px solid grey;
              padding: 16px 0px;
              margin-bottom: 16px;
          }
          .link_he {
              margin-bottom: 16px;
          }
          .link_he span {
              font-weight: 600;
              color: green;
          }
          .link_btn {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 12px;
          }
          .link_btn button {
              border: none;
              background-color: #02dbd7;
              border-radius: 8px;
              width: 50%;
          }
          .link_btn button a {
              display: flex;
              padding: 4px 0px;
              text-align: center;
              justify-content: center;
              text-decoration: none;
              font-size: 20px;
              font-weight: 600;
              color: #fff;
          }
          .link_is_valid {
              background: #ff000042;
              width: 36%;
              margin: 10px auto;
              color: #fff;
              font-size: 12px;
              font-weight: 700;
              border-radius: 10px;
          }
        </style>
        <div class="link_mail">
        <div class="link_mail_box">
        <div class="link_mail_head">PrepAngular</div>
        <div class="link_he">Dear , <span>${user?.first_name}</span></div>
        <div>
            <p class="link_he">Congratulations and welcome to PrepAngular! We are thrilled to have you on board as a valued member of our community.</p>
            <p class="link_he">To ensure the security of your account and provide you with a seamless experience, we kindly ask you to verify your account by clicking on the link below:</p>
        </div>
        <div class="link_btn">
            <button><a href="${url}" target="_blank">Verification Link</a></button>
        </div>
        <div style="text-align: center;">
            <p class="link_is_valid">link is valid for 10 minutes only!</p>
        </div>
        <div>
            <p class="link_he">By verifying your account, you help us maintain a secure environment for all our users and enable us to offer you the best possible service.</p>
        </div>
        <div>
            <p class="link_he">If you encounter any issues during the verification process or have any questions, please feel free to reach out to our support team at
                <span style="cursor: pointer; color: blue;">support.prep.com.</span>
            </p>
        </div>
        <div>
            <p class="link_he">Thank you for choosing PrepAngular. We look forward to serving you and providing an exceptional experience.</p>
        </div>
        <div>
            <p class="link_he">--The Prep Anglular Team!</p>
        </div>
        <div style="border-top: 1px solid grey;">
            <span style="font-size: 12px;">Mohali 7 Phase Sector 61 Sahibzada Ajit Singh Nagar, Punjab 160062</span>
        </div>
        </div>
        </div>
      </body>                
      </html>`,
    });
  }


}
