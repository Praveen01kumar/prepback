/* eslint-disable prettier/prettier */
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { User } from 'src/modules/users/user.table';
import { Post } from 'src/modules/posts/post.table';
import * as SequelizeType from 'sequelize';
import { dialectConfig } from 'src/interface/dbconfig.interface';
import { Record } from 'src/modules/recorded/record.table';
import { PostCtg } from 'src/modules/postcategory/postctg.table';
import { Comment } from 'src/modules/postcomment/postcmt.table'


export const databaseProviders = [{
    provide: SEQUELIZE,
    useFactory: async () => {
        let config;
        switch (process.env.NODE_ENV) {
            case DEVELOPMENT:
                config = databaseConfig.development;
                break;
            case TEST:
                config = databaseConfig.test;
                break;
            case PRODUCTION:
                config = databaseConfig.production;
                break;
            default:
                config = databaseConfig.development;
        }
        const sequelize = new Sequelize(config);
        sequelize.addModels([User, Post, Record, PostCtg, Comment]);
        await sequelize.sync({ force: false, logging: false, alter: false }).then(async () => {
            // await Comment.sync({ alter: true, force: false });
            console.log('Database and tables have been created!');
        }).catch((err) => { console.error('Error syncing the database:', err); });
    },
}];

export const SequelizeConfig: dialectConfig = {
    dialect: process.env.DB_DIALECT as SequelizeType.Dialect,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_TEST,
    models: [],
}