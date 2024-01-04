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
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService) { }

    @Get()
    async findAll() {
        return await this.postService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async findOne(@Param('id') id: number): Promise<PostEntity> {
        const post = await this.postService.findOne(id);
        if (!post) {
            throw new NotFoundException('This Post doesn\'t exist');
        }
        return post;
    }

    @Post('create')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
                    return callback(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async create(@Body() post: PostDto, @Request() req, @UploadedFile() image: Express.Multer.File): Promise<PostEntity> {
        const imagePath = image ? image?.filename : null;
        return await this.postService.create({ ...post, image: imagePath }, req.user.id);
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