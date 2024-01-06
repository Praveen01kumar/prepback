/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = await this.authService.verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ message: 'Token expired' });
      }
      req.user = decoded; 
      next();
    }else{
      res.status(403).send(`Forbidden: Token Not Provided`);
    }
    

  }

}
