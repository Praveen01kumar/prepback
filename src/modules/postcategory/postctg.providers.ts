/* eslint-disable prettier/prettier */
import { POST_CATE_REPOSITORY } from 'src/constants';
import { PostCtg } from './postctg.table';

export const postsCtgProviders = [{
    provide: POST_CATE_REPOSITORY,
    useValue: PostCtg,
}];