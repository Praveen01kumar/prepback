/* eslint-disable prettier/prettier */
import { Table, Column, Model, DataType, ForeignKey, PrimaryKey, Default } from 'sequelize-typescript';
import { User } from '../users/user.table';
import { v4 as uuidv4 } from 'uuid';

@Table
export class Record extends Model<Record> {

    @PrimaryKey
    @Default(() => uuidv4())
    @Column({
        type: DataType.UUID,
        allowNull: false,
        defaultValue: () => uuidv4(),
    })
    id: string;
    
    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    resetpasstime: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    loginotp: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    otpexTime: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true,
    })
    isverified: boolean;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    userId: string;
 
}