/* eslint-disable prettier/prettier */
import { User } from './user.table';
import { USER_REPOSITORY } from 'src/constants';

export const usersProviders = [{
    provide: USER_REPOSITORY,
    useValue: User,
}];