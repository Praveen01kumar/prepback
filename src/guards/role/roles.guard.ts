/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
        if (!roles) {
            return false;
        }
        const request = context.switchToHttp().getRequest();
        const userRoles = request.headers['authorization'];
        const decoded: any = jwt.decode(userRoles.replace('Bearer ', ''), { complete: true });
        return this.validateRoles(roles, decoded?.payload?.role);
    }
    
    validateRoles(roles: string[], userRoles: string[]) {
        if(!userRoles){
            return false;
        }
        return roles.some(role => userRoles.includes(role));
    }
}
