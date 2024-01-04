/* eslint-disable prettier/prettier */
import { RECORD_REPOSITORY } from 'src/constants';
import { Record } from './record.table';

export const recordProviders = [{
    provide: RECORD_REPOSITORY,
    useValue: Record,
}];