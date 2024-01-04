/* eslint-disable prettier/prettier */

import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.table';
import { USER_REPOSITORY } from 'src/constants';
import { UserDto } from './user.dto';


@Injectable()
export class UsersService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User) { }

    async create(user: UserDto): Promise<User> {
        return await this.userRepository.create<User>(user);
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { email } });
    }

    async findOneByUserName(username: string): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { username } });
    }

    async findOneById(id: string | number): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { id } });
    }

    async delete(id: string | number): Promise<string | number> {
        return await this.userRepository.destroy<User>({ where: { id } });
    }

    async updateIP(id: string | number, ip: string): Promise<number> {
        const [uer] = await this.userRepository.update(
            { ip: ip },
            { where: { id } }
        );
        return uer;
    }

    async updateProfileImg(id: string | number, imagePath: string): Promise<void> {
        await this.userRepository.update(
            { profile_img: imagePath },
            { where: { id } }
        );
    }

    async updateUserData(id: string | number, userData: Partial<User>): Promise<any> {
      return await this.userRepository.update(
            { ...userData },
            { where: { id } }
        );
    }

    async ChangePass(id: string | number, password: string): Promise<any> {
        return await this.userRepository.update(
            { password: password },
            { where: { id } }
        );
    }


}