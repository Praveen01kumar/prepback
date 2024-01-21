/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PostsCtgController } from './postctg.controller';
import { postsCtgProviders } from './postctg.providers';
import { PostsCtgService } from './postctg.service';

@Module({
    providers: [PostsCtgService, ...postsCtgProviders],
    controllers: [PostsCtgController],
})
export class PostsCtgModule { }
