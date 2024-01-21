/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.table';
import { PostDto } from './post.dto';
import { RolesGuard } from 'src/guards/role/roles.guard';
import { Roles } from 'src/guards/role/roles';
import { Role } from 'src/enum/users.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfigForPost, uploadPostToCloudinary } from 'src/services/shared.service';
import * as fs from 'fs';
@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService) { }

    @Get()
    async findAll() {
        const post = await this.postService.findAll();
        return { data: post, status: true, messsage: "List Found Successfully!" }
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<any> {
        const post: PostEntity = await this.postService.findOne(id);
        if (!post) {
            throw new NotFoundException('This Post doesn\'t exist');
        }
        return { data: post, status: true, messsage: "Post Found Successfully!" }
    }

    @Post('create')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @UseInterceptors(FileInterceptor('image', MulterConfigForPost))
    async create(@Body() post: PostDto, @Request() req, @UploadedFile() image: Express.Multer.File): Promise<any> {
        try {
            const imagePath = image ? image?.filename : null;
            const cloudinaryResponse = await uploadPostToCloudinary(imagePath);
            if (image.path) {
                const filePath = image.path; 
                fs.unlinkSync(filePath);
            }
            const createdPost: PostEntity = await this.postService.create({ ...post, image: cloudinaryResponse.secure_url }, req.user.id);
            return { post: createdPost, status: true, message: "Post Created Successfully!" }
        } catch (error) {
            return { message: error?.message, status: false };
        }
    }


    @Put(':id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async update(@Param('id') id: number, @Body() post: PostDto, @Request() req): Promise<PostEntity> {
        const { numberOfAffectedRows, updatedPost } = await this.postService.update(id, post, req.user.id);
        if (numberOfAffectedRows === 0) {
            throw new NotFoundException('This Post doesn\'t exist');
        }
        return updatedPost;
    }

    @Delete(':id')
    @Roles(Role.SUPERADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async remove(@Param('id') id: number, @Request() req) {
        const deleted = await this.postService.delete(id, req.user.id);
        if (deleted === 0) {
            throw new NotFoundException('This Post doesn\'t exist');
        }
        return 'Successfully deleted';
    }
}