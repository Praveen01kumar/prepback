/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ALLOWEDHOSTS } from 'src/constants';

@Injectable()
export class HostMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const allowedHosts = ALLOWEDHOSTS;
        const requestHost = req.headers['host'];
        if (allowedHosts.includes(requestHost)) {
            next();
        } else {
            throw new UnauthorizedException('Host not allowed');
        }
    }
}
