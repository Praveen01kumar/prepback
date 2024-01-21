/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class CommentDto {

    @IsNotEmpty()
    readonly content: string;

}