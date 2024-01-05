/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AgentMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
      const allowedFrontend = ['http://localhost:4200', 'https://prepangular1.web.app'];
      const userAgent = req?.headers?.origin;
    if (userAgent && allowedFrontend.some(browser => userAgent.includes(browser))) {
      next();
    } else {
      res.status(HttpStatus.FORBIDDEN).send(`Forbidden: Only ${allowedFrontend.join(' or ')} is allowed`);
    }
  }
}
