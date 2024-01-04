/* eslint-disable prettier/prettier */
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, Default } from 'sequelize-typescript';
import { User } from '../users/user.table';
import { v4 as uuidv4 } from 'uuid';

@Table
export class Post extends Model<Post> {

    @PrimaryKey
    @Default(() => uuidv4())
    @Column({
        type: DataType.UUID,
        allowNull: false,
        defaultValue: () => uuidv4(),
    })
    id: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    body: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    image: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    userId: string;

    @BelongsTo(() => User)
    user: User;
}