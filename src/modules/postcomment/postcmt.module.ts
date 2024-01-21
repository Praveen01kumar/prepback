/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { postsCmtProviders } from './postcmt.providers';
import { PostsCmtService } from './postcmt.service';
import { PostsCmtController } from './postcmt.controller';

@Module({
    providers: [PostsCmtService, ...postsCmtProviders],
    controllers: [PostsCmtController],
})
export class PostsCmtModule { }
