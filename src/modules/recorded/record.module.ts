/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { recordProviders } from './record.providers';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';

@Module({
    providers: [RecordService, ...recordProviders],
    controllers: [RecordController],
})
export class RecordModule { }
