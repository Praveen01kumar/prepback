/* eslint-disable prettier/prettier */
import { Controller, Body, Post, UseGuards, Request, Delete, NotFoundException, Req, Param, UploadedFile, UseInterceptors, ForbiddenException, Patch, Get, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserDto } from '../users/user.dto';
import { Request as ExpressRequest } from 'express';
import { LocationGuard } from 'src/guards/Location/location.guard';
import { AllowedCountries } from 'src/guards/Location/countries';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig, extractPublicIdFromCloudinaryUrl, updateCloudinaryImage } from 'src/services/shared.service';
import { UsersService } from '../users/users.service';
import * as fs from 'fs';
import { RecordService } from '../recorded/record.service';
import { RecordDto } from '../recorded/record.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly userService: UsersService,
        private readonly recordService: RecordService
    ) { }

    @UseGuards(AuthGuard('local'), LocationGuard)
    @AllowedCountries('IN', 'GB')
    @Post('login')
    async login(@Request() req) {
        return await this.authService.login(req, req?.ip);
    }

    @Post('logout')
    async logout(@Request() req) {
        return await this.authService.logout(req?.body, req?.ip);
    }

    // @Post('signup')
    // @UseInterceptors(FileInterceptor('profile_img', MulterConfig))
    // async signUp(@Body() user: UserDto, @UploadedFile() profile_img: Express.Multer.File) {

    //     const userExistByEmail = await this.userService.findOneByEmail(user.email);
    //     if (userExistByEmail) {
    //         const filePath = profile_img.path;
    //         fs.unlinkSync(filePath);
    //         throw new ForbiddenException('This email already exist');
    //     }
    //     const userExistByUser = await this.userService.findOneByUserName(user.username);
    //     if (userExistByUser) {
    //         const filePath = profile_img.path;
    //         fs.unlinkSync(filePath);
    //         throw new ForbiddenException('This username already exist');
    //     }
    //     const imagePath = profile_img ? profile_img?.filename : null;
    //     const cloudinaryResponse = await uploadToCloudinary(imagePath);

    //     if (profile_img.path) {
    //         const filePath = profile_img.path; // delete file from profileimg forlder
    //         fs.unlinkSync(filePath);
    //     }

    //     return await this.authService.create({ ...user, profile_img: cloudinaryResponse.secure_url });
    // }

    @Post('signup') // signup without profile image
    async signUp(@Body() user: UserDto) {
        const userExistByEmail = await this.userService.findOneByEmail(user.email);
        if (userExistByEmail) {
            throw new ForbiddenException('This email already exist');
        }
        const userExistByUser = await this.userService.findOneByUserName(user.username);
        if (userExistByUser) {
            throw new ForbiddenException('This username already exist');
        }
        return await this.authService.create({ ...user });
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('update_pf_img') // profile image update 
    @UseInterceptors(FileInterceptor('profile_img', MulterConfig))
    async updateProfileImg(@UploadedFile() profile_img: Express.Multer.File, @Request() req) {
        try {
            const userId = req?.user?.id;
            if (!userId) {
                const filePath = profile_img.path;
                fs.unlinkSync(filePath);
                throw new ForbiddenException('User not authenticated');
            }
            const user = await this.userService.findOneById(userId);
            if (!user) {
                const filePath = profile_img.path;
                fs.unlinkSync(filePath);
                throw new NotFoundException('User not found');
            }
            // if (user.profile_img) {
            //     const oldImagePath = `../../../profileImg/${user.profile_img}`;
            //     fs.unlinkSync(oldImagePath);
            // }
            const imagePath = profile_img ? profile_img?.filename : null;
            const getPublicId = await extractPublicIdFromCloudinaryUrl(user?.profile_img);
            const cloudinaryResponse = await updateCloudinaryImage(imagePath, getPublicId);
            await this.userService.updateProfileImg(userId, cloudinaryResponse.secure_url);
            if (profile_img.path) {
                const filePath = profile_img.path; // delete file from profileimg forlder 
                fs.unlinkSync(filePath);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { ip, password, ...userData } = user['dataValues'];
            return { status: true, message: 'Profile image updated successfully', user: userData };
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('delete') // delete user by id in body 
    async remove(@Body('id') id: string, @Body('user_id') user_id: string, @Req() request: ExpressRequest) {
        try {
            return await this.authService.deleteUser(id, user_id, request);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw error;
            }
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')// delete user by it self by id in params
    async removeSelf(@Param('id') id: string | number, @Req() request: ExpressRequest) {
        try {
            return await this.authService.deleteSelf(id, request);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw error;
            }
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('update') // update user by id in body 
    async updateUser(@Body('id') id: string, @Body('user_id') user_id: string, @Req() request: ExpressRequest) {
        try {
            return await this.authService.updateUser(id, user_id, request);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw error;
            }
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('update_self') // update user self by id in body 
    async updateUserSelf(@Body('id') id: string, @Req() request: ExpressRequest) {
        try {
            return await this.authService.updateUserSelf(id, request);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw error;
            }
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('change_pass') // chnage user password by id in body 
    async changeUserPass(@Body('id') id: string, @Body('user_id') user_id: string, @Req() request: ExpressRequest) {
        try {
            return await this.authService.changeUserPass(id, user_id, request);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw error;
            }
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('change_pass_self') // update user self by id in body 
    async changeUserPassSelf(@Body('id') id: string, @Req() request: ExpressRequest) {
        try {
            return await this.authService.changeUserPassSelf(id, request);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw error;
            }
        }
    }

    @Post('forgot_pass') // forgot password
    async forgotPassword(@Req() request: ExpressRequest) {
        try {
            return await this.authService.forgotPass(request);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw error;
            }
        }
    }

    @Post('reset_pass') // reset password
    async resetPassword(@Req() request: ExpressRequest) {
        try {
            return await this.authService.resetPass(request);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw error;
            }
        }
    }

    @Post('mailtoresetpass') // forgot password
    async resetPassmail(@Req() request: ExpressRequest) {
        try {
            return await this.authService.setPassmail(request);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw error;
            }
        }
    }

    @Post('verify-account-mail') // sending mail to account verification using this route by user
    async verifyMail(@Req() request: ExpressRequest) {
        const email = request?.body?.email;
        try {
            return await this.authService.sendVerifymail(email);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw error;
            }
        }
    }

    @Get('reset-password')
    async resetPassPage(@Query('token') token: string) {
        try {
            const isValidToken = await this.authService.verifyToken(token);
            if (!isValidToken) {
                throw new ForbiddenException('Invalid or expired reset token');
            }
            return await this.authService.renderRPHTMLPage();
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw new ForbiddenException(error.message);
            } else {
                throw error;
            }
        }
    }

    @Get('account-verification') // render verify account page on this route
    async accountverifypage(@Query('token') token: string) {
        try {
            const isValidToken = await this.authService.verifyToken(token);

            if (!isValidToken) {
                return await this.authService.pageNoteFound();
                // throw new ForbiddenException('Invalid or expired reset token');
            } else {
                return await this.authService.renderVAHTMLPage();
            }
        } catch (error) {
            if (error instanceof ForbiddenException) {
                return await this.authService.pageNoteFound();
                // throw new ForbiddenException(error.message);
            } else {
                return await this.authService.pageNoteFound();
                // throw error;
            }
        }
    }

    @Post('forgot-password')
    async forgotPassPage(@Req() request: ExpressRequest) {
        const password = request?.body?.newPassword?.trim();
        const token = request?.body?.token;
        try {

            const isValidToken = await this.authService.verifyToken(token);
            const id = isValidToken?.data?.id;

            const email = isValidToken?.data?.email;
            if (!isValidToken) { throw new ForbiddenException('Invalid or expired reset token'); };

            const email_user = await this.userService.findOneByEmail(email);
            if (!email_user) { throw new NotFoundException(`Email not found`) };

            const tokentime = isValidToken?.exp - isValidToken?.iat;
            const currentTimestamp = new Date().getTime();
            const passuptime = await this.recordService.findOneByUId(email_user.id);
            const userUpdatedAtTimestamp = new Date(passuptime?.resetpasstime).getTime();
            const timeDifference = currentTimestamp - userUpdatedAtTimestamp;
            const seconds = Math.floor(timeDifference / 1000);
            if (seconds <= tokentime) { throw new ForbiddenException(`You updated your Password ${seconds} seconds ago! Please Wait for ${tokentime - seconds} seconds`); };

            const pass = await this.authService.hashPassword(password);
            const passchanged = await this.userService.ChangePass(id, pass);

            const recData: Partial<RecordDto> = { resetpasstime: new Date().toISOString() };
            await this.recordService.updateRecord(recData, email_user.id);

            return passchanged ? { status: true, message: "password change successfully!", newpassword: password } : { status: false, message: "An error occurred!" };
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw new ForbiddenException(error.message);
            } else {
                throw error;
            }
        }
    }

    @Post('mail-login-otp') // login otp
    async loginotpMail(@Req() request: ExpressRequest) {
        try {
            return await this.authService.loginOTP(request);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw error;
            }
        }
    }

    @Post('verify-me')// account will verified by this route
    async verifyMe(@Req() request: ExpressRequest) {
        const token = request?.body?.token;
        try {
            const isValidToken = await this.authService.verifyToken(token);
            if (!isValidToken) { throw new ForbiddenException('Invalid or expired reset token'); };

            const user_id = isValidToken?.data?.id;
            const email = isValidToken?.data?.email;
            const recData: Partial<RecordDto> = { isverified: true };

            const email_user = await this.userService.findOneByEmail(email);
            if (!email_user) { throw new NotFoundException(`User not found`) };

            const record = await this.recordService.findOneByUId(user_id);
            if (record?.isverified) { return { status: true, message: "Account is verifieed successfully!" }; }

            const updatedRecord = await this.recordService.updateRecord(recData, user_id);
            if (!updatedRecord) { throw new NotFoundException(`Unable to varify account!`); }

            return { status: true, message: "Account is verifieed successfully!" };
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw new ForbiddenException(error.message);
            } else {
                throw error;
            }
        }
    }

}