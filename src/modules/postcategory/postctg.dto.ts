/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class PostCtgDto {

    @IsNotEmpty()
    readonly name: string;

}