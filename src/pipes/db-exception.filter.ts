/* eslint-disable prettier/prettier */

import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { UniqueConstraintError } from 'sequelize';

@Catch()
export class DbExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof UniqueConstraintError) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { instance , ...error  } = { ...exception.errors[0] };
      const response = {
        statusCode: HttpStatus.BAD_REQUEST,
        ...error
      };

      const ctx = host.switchToHttp();
      const responseObj = ctx.getResponse();
      responseObj.status(HttpStatus.BAD_REQUEST).json(response);
    } else if (exception instanceof Error) {
      const response = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
      };
      const ctx = host.switchToHttp();
      const responseObj = ctx.getResponse();
      responseObj.status(HttpStatus.BAD_REQUEST).json(response);
    } else {
      super.catch(exception, host);
    }
  }
}
