/* eslint-disable prettier/prettier */
import { POST_CMMT_REPOSITORY } from 'src/constants';
import { Comment } from './postcmt.table';

export const postsCmtProviders = [{
    provide: POST_CMMT_REPOSITORY,
    useValue: Comment,
}];