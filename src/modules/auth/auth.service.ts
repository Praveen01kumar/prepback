/* eslint-disable prettier/prettier */
import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';
import { Role } from 'src/enum/users.enum';
import { deleteImageFromCloudinary, extractPublicIdFromCloudinaryUrl } from 'src/services/shared.service';
import { MailService } from 'src/services/email.service';
import * as fs from 'fs';
import * as path from 'path';
import { RecordService } from '../recorded/record.service';
import { RecordDto } from '../recorded/record.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly recordService: RecordService
    ) { }

    public async validateUser(email: string, pass: string) {
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            return { type: 'email', value: null };
        }
        const match = await this.comparePassword(pass, user.password);
        if (!match) {
            return { type: 'pass', value: null };
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user['dataValues'];
        return { type: 'res', value: result };
    }

    public async login(uservalue, userip: string) {
        if (userip === uservalue?.user?.ip) {
            const updateIp = await this.userService.updateIP(uservalue?.user?.id, userip);
            if (!updateIp) { throw new NotFoundException(`User not found`) }
        }
        if (userip !== uservalue?.user?.ip) {
            throw new NotFoundException(`You are logged in somewhere else; please log out first!`);
        }
        const recordData = await this.recordService.findOneByUId(uservalue?.user?.id);
        const { loginotp, otpexTime } = recordData;
        const timeDifferenceInMilliseconds = Number(new Date()) - Number(new Date(otpexTime));
        const timeDifferenceInMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));

        if (uservalue?.body?.otp !== loginotp) {
            throw new NotFoundException(`Invalid OTP!`);
        }
        if (timeDifferenceInMinutes > 10) {
            throw new NotFoundException(`OTP has been expaired!`);
        }
        const token = await this.generateToken(uservalue?.user);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ip, ...user } = uservalue?.user;

        const recData: Partial<RecordDto> = { loginotp: null, otpexTime: null };
        await this.recordService.updateRecord(recData, uservalue?.user?.id);

        const res = { user: user, token: token, status: true, message: "User loggedin successfully!" }
        return res;
    }

    public async logout(uservalue, ip: string) {
        const userExist = await this.userService.findOneByEmail(uservalue?.email);
        if (!userExist) {
            throw new ForbiddenException('User not Found!');
        }
        const updateIp = await this.userService.updateIP(userExist['dataValues']?.id, ip);
        if (!updateIp) { throw new NotFoundException(`User not found!`) }
        return { message: "User logged out successfully please login now!", status: true };
    }

    public async create(user) {
        const pass = await this.hashPassword(user.password);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { role, ...withoutrole } = user;
        const newUser = await this.userService.create({ ...withoutrole, password: pass });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ip, ...result } = newUser['dataValues'];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const token = await this.generateToken(result);
        const recData: Partial<RecordDto> = {};
        await this.sendVerifymail(newUser?.email);
        await this.recordService.create(recData, newUser?.id);
        return { user: result, status: true, message: "User Registered Successfully!, please check email to verify your account" };
    }

    private async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    public async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }

    public async deleteUser(id: number | string, user_id: string, request: any) {
        const userToken = request.headers['authorization'];
        const decoded: any = jwt.decode(userToken.replace('Bearer ', ''), { complete: true });
        const [deleted_to_user, deleted_by_user] = await Promise.all([this.userService.findOneById(id), this.userService.findOneById(user_id)]);
        const dtrole = deleted_to_user?.role;
        const dbrole = deleted_by_user?.role;
        if (user_id === decoded?.payload?.id) {
            if (!deleted_by_user) { throw new NotFoundException(`User not found`) }
            if (!deleted_to_user) { throw new NotFoundException(`User you want to delete is not exist`) }
            if (dbrole === Role?.SUPERADMIN && dtrole !== Role?.SUPERADMIN) {
                const deletedUser = await this.userService.delete(id);
                if (!deletedUser) {
                    throw new NotFoundException(`User not found`);
                }
                const getPublicId = await extractPublicIdFromCloudinaryUrl(deleted_to_user?.profile_img);
                const deleteUser = await deleteImageFromCloudinary(getPublicId);
                if (!deleteUser) {
                    throw new NotFoundException(`Error in deleting user`);
                }
                return { message: `User deleted successfully`, status: true, statusCode: 200 };
            }
            if (dbrole === Role?.ADMIN && dtrole === Role?.USER) {
                const deletedUser = await this.userService.delete(id);
                if (!deletedUser) {
                    throw new NotFoundException(`User not found`);
                }
                const getPublicId = await extractPublicIdFromCloudinaryUrl(deleted_to_user?.profile_img);
                const deleteUser = await deleteImageFromCloudinary(getPublicId);
                if (!deleteUser) {
                    throw new NotFoundException(`Error in deleting user`);
                }
                return { message: `User deleted successfully`, status: true, statusCode: 200 };
            }
            throw new HttpException('You can not delete this user', HttpStatus.FORBIDDEN);
        } else {
            throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
        }
    }

    public async deleteSelf(id: number | string, request: any) {
        const userToken = request.headers['authorization'];
        const decoded: any = jwt.decode(userToken.replace('Bearer ', ''), { complete: true });
        if (id === decoded?.payload?.id) {
            const deletedUser = await this.userService.delete(id);
            if (!deletedUser) {
                throw new NotFoundException(`User not found`);
            }
            const getPublicId = await extractPublicIdFromCloudinaryUrl(decoded?.payload?.profile_img);
            const deleteUser = await deleteImageFromCloudinary(getPublicId);
            if (!deleteUser) {
                throw new NotFoundException(`Error in deleting user`);
            }
            return { message: `User deleted successfully`, status: true, statusCode: 200 };
        } else {
            throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
        }
    }

    public async verifyToken(token: string): Promise<any> {
        try {
            const decoded = this.jwtService.verify(token);
            return decoded;
        } catch (error) {
            return null;
        }
    }

    public async updateUser(id: number | string, user_id: string, request: any) {
        const userToken = request.headers['authorization'];
        const requestBodyData = request?.body?.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userReqData } = requestBodyData;
        const decoded: any = jwt.decode(userToken.replace('Bearer ', ''), { complete: true });
        const [updated_to_user, updated_by_user] = await Promise.all([this.userService.findOneById(id), this.userService.findOneById(user_id)]);
        const utrole = updated_to_user?.role;
        const ubrole = updated_by_user?.role;
        if (user_id === decoded?.payload?.id) {
            if (!updated_by_user) { throw new NotFoundException(`User not found`) }
            if (!updated_to_user) { throw new NotFoundException(`User you want to update is not exist`) }
            if (ubrole === Role?.SUPERADMIN && utrole !== Role?.SUPERADMIN) {
                const updateeUser = await this.userService.updateUserData(id, userReqData);
                if (!updateeUser) {
                    throw new NotFoundException(`User not found`);
                }
                return { message: `User updated successfully`, status: true, statusCode: 200 };
            }
            if (ubrole === Role?.ADMIN && utrole === Role?.USER) {
                const updateeUser = await this.userService.updateUserData(id, userReqData);
                if (!updateeUser) {
                    throw new NotFoundException(`User not found`);
                }
                return { message: `User updated successfully`, status: true, statusCode: 200 };
            }
            throw new HttpException('You can not update this user', HttpStatus.FORBIDDEN);
        } else {
            throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
        }
    }

    public async updateUserSelf(id: number | string, request: any) {
        const requestBodyData = request?.body?.data;
        const userToken = request.headers['authorization'];
        const decoded: any = jwt.decode(userToken.replace('Bearer ', ''), { complete: true });
        if (id === decoded?.payload?.id) {
            const updated_to_user = await this.userService.findOneById(id);
            if (!updated_to_user) { throw new NotFoundException(`User not found`) };
            if (requestBodyData) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, role, ip, email, username, ...userReqData } = requestBodyData;
                const updateeUser = await this.userService.updateUserData(id, userReqData);
                if (!updateeUser) { throw new NotFoundException(`User not found`); }
            }
            const updated_user = await this.userService.findOneById(id);
            if (!updated_user) { throw new NotFoundException(`User not found`) };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { ip, password, ...userData } = updated_user['dataValues'];
            return { message: `User updated successfully`, status: true, statusCode: 200, user: userData };
        } else {
            throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
        }

    }

    public async changeUserPass(id: number | string, user_id: string, request: any) {
        const userToken = request.headers['authorization'];
        const requestBodyData = request?.body?.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userReqData } = requestBodyData;
        const pass = await this.hashPassword(password);
        const decoded: any = jwt.decode(userToken.replace('Bearer ', ''), { complete: true });
        const [updated_to_user, updated_by_user] = await Promise.all([this.userService.findOneById(id), this.userService.findOneById(user_id)]);
        const utrole = updated_to_user?.role;
        const ubrole = updated_by_user?.role;
        if (user_id === decoded?.payload?.id) {
            if (!updated_by_user) { throw new NotFoundException(`User not found`) }
            if (!updated_to_user) { throw new NotFoundException(`User you want to change password is not exist`) }
            if (ubrole === Role?.SUPERADMIN && utrole !== Role?.SUPERADMIN) {
                const updateeUser = await this.userService.ChangePass(id, pass);
                if (!updateeUser) {
                    throw new NotFoundException(`User not found`);
                }
                return { message: `User password updated successfully`, status: true, statusCode: 200 };
            }
            if (ubrole === Role?.ADMIN && utrole === Role?.USER) {
                const updateeUser = await this.userService.ChangePass(id, pass);
                if (!updateeUser) {
                    throw new NotFoundException(`User not found`);
                }
                return { message: `User password updated successfully`, status: true, statusCode: 200 };
            }
            throw new HttpException('You can not update password of this user', HttpStatus.FORBIDDEN);
        } else {
            throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
        }
    }

    public async changeUserPassSelf(id: number | string, request: any) {
        const userToken = request.headers['authorization'];
        const decoded: any = jwt.decode(userToken.replace('Bearer ', ''), { complete: true });
        if (id === decoded?.payload?.id) {
            const requestBodyData = request?.body?.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userReqData } = requestBodyData;
            const pass = await this.hashPassword(password);
            const updated_to_user = this.userService.findOneById(id);
            if (!updated_to_user) { throw new NotFoundException(`User not found`) };
            const updateeUser = await this.userService.ChangePass(id, pass);
            if (!updateeUser) {
                throw new NotFoundException(`User not found`);
            }
            return { message: `Password updated successfully`, status: true, statusCode: 200 };
        } else {
            throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
        }
    }

    public async forgotPass(request: any) {
        const requestBodyData = request?.body;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { email, username, ...userReqData } = requestBodyData;
        let token = null;
        if (email) {
            const email_user = await this.userService.findOneByEmail(email);
            if (!email_user) { throw new NotFoundException(`Email not found`) };
            token = jwt.sign({ data: email_user }, process.env.JWTKEY, { expiresIn: '10m' });
        }
        if (username) {
            const username_user = await this.userService.findOneByUserName(username);
            if (!username_user) { throw new NotFoundException(`UserName not found`) };
            token = jwt.sign({ data: username_user }, process.env.JWTKEY, { expiresIn: '10m' });
        }
        return { token };
    }

    public async resetPass(request: any) {
        const requestBodyData = request?.body;
        const userToken = request.headers['authorization'].replace('Bearer ', '');
        const decoded: any = jwt.decode(userToken, { complete: true });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { email, username, password, ...userReqData } = requestBodyData;
        const decodedToken = jwt.verify(userToken, process.env.JWTKEY);

        if (email) {
            const email_user = await this.userService.findOneByEmail(email);
            if (!email_user) { throw new NotFoundException(`Email not found`) };
            if (decoded?.payload?.data?.email !== email) { throw new NotFoundException(`Token is not valid`) };
            if (decodedToken) {
                const pass = await this.hashPassword(password);
                await this.userService.ChangePass(email_user?.id, pass);
            }
        }

        if (username) {
            const username_user = await this.userService.findOneByEmail(username);
            if (!username_user) { throw new NotFoundException(`UserName not found`) };
            if (decoded?.payload?.data?.username !== username) { throw new NotFoundException(`Token is not valid`) };
            if (decodedToken) {
                const pass = await this.hashPassword(password);
                await this.userService.ChangePass(username_user?.id, pass);
            }
        }
        return { message: `Password updated successfully`, status: true, statusCode: 200, password: password };
    }

    public async setPassmail(request: any) {
        const requestBodyData = request?.body;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { email, username, ...userReqData } = requestBodyData;
        if (email) {
            const email_user = await this.userService.findOneByEmail(email);
            if (!email_user) { throw new NotFoundException(`Email not found`) };
            const token = jwt.sign({ data: email_user }, process.env.JWTKEY, { expiresIn: '5m' });
            await this.mailService.sendUserConfirmation(email_user, token);

        }
        if (username) {
            const username_user = await this.userService.findOneByUserName(username);
            if (!username_user) { throw new NotFoundException(`UserName not found`) };
            const token = jwt.sign({ data: username_user }, process.env.JWTKEY, { expiresIn: '5m' });
            await this.mailService.sendUserConfirmation(username_user, token);
        }
        return { status: true, message: "Password reset link send successfully!" };
    }

    public async sendVerifymail(email: string) {
        if (email) {
            const email_user = await this.userService.findOneByEmail(email);
            if (!email_user) { throw new NotFoundException(`Email not found`) };
            const token = jwt.sign({ data: email_user }, process.env.JWTKEY, { expiresIn: '10m' });
            await this.mailService.accountVerification(email_user, token);
        }
        return { status: true, message: "Account Verification Link send successfully!" };
    }

    public async renderRPHTMLPage() {
        const htmlContent = fs.readFileSync(path.join(process.cwd(), 'src', 'views', 'reset_password.html'), 'utf-8');
        return htmlContent;
    }

    public async renderVAHTMLPage() {
        const htmlContent = fs.readFileSync(path.join(process.cwd(), 'src', 'views', 'verify_acc.html'), 'utf-8');
        return htmlContent;
    }

    public async loginOTP(request: any) {
        const requestBodyData = request?.body;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { email, username, ...userReqData } = requestBodyData;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        if (email) {
            const email_user = await this.userService.findOneByEmail(email);
            if (!email_user) { throw new NotFoundException(`User not found!`) };
            const recData: Partial<RecordDto> = { loginotp: otp, otpexTime: new Date().toISOString() };
            await this.mailService.sendLoginOTP(email_user, otp);
            await this.recordService.updateRecord(recData, email_user.id);

        }
        if (username) {
            const username_user = await this.userService.findOneByUserName(username);
            if (!username_user) { throw new NotFoundException(`UserName not found`) };
            const recData: Partial<RecordDto> = { loginotp: otp, otpexTime: new Date().toISOString() };
            await this.mailService.sendLoginOTP(username_user, otp);
            await this.recordService.updateRecord(recData, username_user.id);
        }
        return { status: true, message: "login OTP send successfully!" };
    }

    public async pageNoteFound() {
        const htmlContent = fs.readFileSync(path.join(process.cwd(), 'src', 'views', 'page_not_found.html'), 'utf-8');
        return htmlContent;
    }


}


