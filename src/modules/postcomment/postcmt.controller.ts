/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { Comment as CommentEntity } from './postcmt.table';
import { PostsCmtService } from './postcmt.service';
import { AuthGuard } from '@nestjs/passport';
import { CommentDto } from './postcmt.dto';

@Controller('comment')
export class PostsCmtController {
    constructor(private readonly postsCmtService: PostsCmtService) { }

    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() post: CommentDto, @Request() req): Promise<any> {
        const user = {
            userId: req?.user?.id,
            name: req?.user?.first_name + " " + req?.user?.last_name,
            email: req?.user?.email,
            profile_pic: req?.user?.profile_img
        };
        const comment: CommentEntity = await this.postsCmtService.create({ ...post }, user);
        return { comment: comment, status: true, message: "Commented Successfully!" };
    }

    @Post('comment_list')
    @UseGuards(AuthGuard('jwt'))
    async post(@Body() postId: any): Promise<any> {
        const commnets = await this.postsCmtService.findAll(postId?.postId);
        return { data: commnets, status: true, messsage: "List Found Successfully!" }
    }

}