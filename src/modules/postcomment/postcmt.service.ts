/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { POST_CMMT_REPOSITORY } from 'src/constants';
import { Comment } from './postcmt.table';
import { CommentDto } from './postcmt.dto';

@Injectable()
export class PostsCmtService {
    constructor(@Inject(POST_CMMT_REPOSITORY) private readonly commentRepository: typeof Comment) { }

    async create(comment: CommentDto, user:any): Promise<Comment> {
        return await this.commentRepository.create<Comment>({ ...comment, ...user });
    }

    async findAll(postId:string): Promise<Comment[]> {
        return await this.commentRepository.findAll<Comment>({
            where: { postId },
        });
    }

}