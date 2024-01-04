/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ProtocolMiddleware implements NestMiddleware {
  private readonly allowedProtocols = ['http', 'https'];
  use(req: Request, res: Response, next: NextFunction) {
    const protocol = req.protocol.toLowerCase();
    if (this.allowedProtocols.includes(protocol)) {
      next(); 
    } else {
      res.status(403).send(`Forbidden: Only ${this.allowedProtocols.join(' or ')} requests are allowed`);
    }
  }
}
