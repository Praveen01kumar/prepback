/* eslint-disable prettier/prettier */
import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/user.table';
import { Post } from '../posts/post.table';

@Table
export class Comment extends Model<Comment> {

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
    content: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    profile_pic: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    userId: string;

    @BelongsTo(() => User, { as: 'user' })
    user: User;

    @ForeignKey(() => Post)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    postId: string;

    @BelongsTo(() => Post, { as: 'post' })
    post: Post;

}