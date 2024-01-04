/* eslint-disable prettier/prettier */
import { POST_REPOSITORY } from 'src/constants';
import { Post } from './post.table';

export const postsProviders = [{
    provide: POST_REPOSITORY,
    useValue: Post,
}];