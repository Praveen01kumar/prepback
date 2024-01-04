/* eslint-disable prettier/prettier */

import { IsNotEmpty } from "class-validator";

export class RecordDto {
    
    @IsNotEmpty()
    readonly resetpasstime: string;

    @IsNotEmpty()
    readonly loginotp: string;

    @IsNotEmpty()
    readonly otpexTime: string;

    @IsNotEmpty()
    readonly isverified: boolean;

    

}