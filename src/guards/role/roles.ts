/* eslint-disable prettier/prettier */
import {SetMetadata} from '@nestjs/common';
import { Role } from 'src/enum/users.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);