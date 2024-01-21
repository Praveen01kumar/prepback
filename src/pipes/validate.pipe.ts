/* eslint-disable prettier/prettier */
import { Injectable, ArgumentMetadata, BadRequestException, ValidationPipe } from '@nestjs/common';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
   public async transform(value, metadata: ArgumentMetadata) {
      try {
         return await super.transform(value, metadata);
      } catch (error) {

         this.handleTransformError(error);

         // if (e instanceof BadRequestException) {
         //    console.log('this.handleError(e)',this.handleError(e));
         //    throw new UnprocessableEntityException(this.handleError(e));
         // }

         return { message: error?.message, status: false };
      }

   }

   // private handleError(errors: any): any[] {
   //    if (errors.response && Array.isArray(errors.response.message)) {
   //       return errors.response.message;
   //    } else if (Array.isArray(errors)) {
   //       return errors.map((error) => typeof error === 'string' ? { message: error } : error.constraints);
   //    } else if (typeof errors === 'string') {
   //       return [{ message: errors }];
   //    } else if (typeof errors === 'object' && errors.constraints) {
   //       return [errors.constraints];
   //    } else {
   //       return [];
   //    }
   // }

   private handleTransformError(error: any): void {
      if (error instanceof BadRequestException) {
         const response = error.getResponse() as { message?: string | string[] };
         const originalMessages = response?.message;
         let validationErrors: string[] = [];
         if (Array.isArray(originalMessages)) {
            validationErrors = originalMessages.map((msg) => `${msg}`);
         } else if (typeof originalMessages === 'string') { validationErrors.push(`${originalMessages}`); }
         const customResponse = { message: validationErrors, error: 'Validation Error', statusCode: 400 };
         error.message = JSON.stringify(validationErrors);
         error.getResponse = () => customResponse;
      }
   }


}
