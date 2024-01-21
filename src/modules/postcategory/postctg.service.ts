/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { POST_CATE_REPOSITORY } from 'src/constants';
import { PostCtg } from './postctg.table';
import { PostCtgDto } from './postctg.dto';

@Injectable()
export class PostsCtgService {
    constructor(@Inject(POST_CATE_REPOSITORY) private readonly postctgRepository: typeof PostCtg) { }

    async findAll(): Promise<PostCtg[]> {
        return await this.postctgRepository.findAll<PostCtg>({});
    }

    async create(post: PostCtgDto): Promise<PostCtg> {
        return await this.postctgRepository.create<PostCtg>({ ...post });
    }

}