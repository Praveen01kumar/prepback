/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { RECORD_REPOSITORY } from 'src/constants';
import { Record } from './record.table';
import { User } from '../users/user.table';
import { RecordDto } from './record.dto';

@Injectable()
export class RecordService {
    constructor(@Inject(RECORD_REPOSITORY) private readonly recordRepository: typeof Record) { }

    async findAll(): Promise<Record[]> {
        return await this.recordRepository.findAll<Record>({
            include: [{ model: User, attributes: { exclude: ['password', 'id', 'role'] } }],
        });
    }

    async create(record: Partial<RecordDto>, userId: string): Promise<Record> {
        return await this.recordRepository.create<Record>({ ...record, userId });
    }

    async findOneByUId(userId: string): Promise<Record> {
        return await this.recordRepository.findOne<Record>(
            { where: { userId } }
        );
    }

    async updateRecord(record: Partial<RecordDto>, userId: string): Promise<number> {
        const [rec] = await this.recordRepository.update(
            { ...record },
            { where: { userId } }
        );
        return rec;
    }

}