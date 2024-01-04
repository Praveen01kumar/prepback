/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BrowserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedBrowsers = ['Chrome', 'Edge', 'Postman']; 
    const userAgent = req.headers['user-agent'];
    if (userAgent && allowedBrowsers.some(browser => userAgent.includes(browser))) {
      next(); 
    } else {
      res.status(403).send(`Forbidden: Only ${allowedBrowsers.join(' or ')} browser is allowed`);
    }
  }
}
