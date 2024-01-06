/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ALLOWEDBROWSERS } from 'src/constants';

@Injectable()
export class AgentMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedBrowsers = ALLOWEDBROWSERS; 
    const userBrowser = req.headers['user-agent'];
    if (userBrowser && allowedBrowsers.some(browser => userBrowser.includes(browser))) {
      next(); 
    } else {
      res.status(403).send(`Forbidden: Only ${allowedBrowsers.join(' or ')} browsers are allowed`);
    }
  }
}
