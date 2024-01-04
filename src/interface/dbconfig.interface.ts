/* eslint-disable prettier/prettier */
import * as SequelizeType from 'sequelize';

export interface dbConfigAttributes {
    username?: string;
    password?: string;
    database?: string;
    host?: string;
    port?: number | string;
    dialect?: string;
    urlDatabase?: string;
}

export interface dbConfig {
    development: dbConfigAttributes;
    test: dbConfigAttributes;
    production: dbConfigAttributes;
}

export interface dialectConfig {
    dialect: SequelizeType.Dialect;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    models: [];
}