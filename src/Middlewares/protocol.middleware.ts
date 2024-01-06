/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ALLOWEDPROTOCOLS } from 'src/constants';

@Injectable()
export class ProtocolMiddleware implements NestMiddleware {
  private readonly allowedProtocols = ALLOWEDPROTOCOLS;
  use(req: Request, res: Response, next: NextFunction) {
    const protocol = req.protocol.toLowerCase();
    if (this.allowedProtocols.includes(protocol)) {
      next(); 
    } else {
      res.status(403).send(`Forbidden: Only ${this.allowedProtocols.join(' or ')} Protocols are allowed`);
    }
  }
}
