/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PostCtg as PostCtgEntity } from './postctg.table';
import { PostsCtgService } from './postctg.service';
import { Roles } from 'src/guards/role/roles';
import { Role } from 'src/enum/users.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/role/roles.guard';
import { PostCtgDto } from './postctg.dto';

@Controller('postctg')
export class PostsCtgController {
    constructor(private readonly postCtgService: PostsCtgService) { }

    @Get()
    async findAll() {
        const category = await this.postCtgService.findAll();
        return { category: category, status: true, message: "Category Found Successfully!" };
    }

    @Post('create')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async create(@Body() post: PostCtgDto): Promise<any> {
        const category: PostCtgEntity = await this.postCtgService.create({ ...post });
        return { category: category, status: true, message: "Category Created Successfully!" };
    }

}