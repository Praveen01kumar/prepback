/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { Post } from './post.table';
import { User } from '../users/user.table';
import { POST_REPOSITORY } from 'src/constants';
import { PostDto } from './post.dto';
import { literal } from 'sequelize';
import { Comment } from '../postcomment/postcmt.table';

@Injectable()
export class PostsService {
    constructor(@Inject(POST_REPOSITORY) private readonly postRepository: typeof Post) { }

    async create(post: PostDto, userId): Promise<Post> {
        return await this.postRepository.create<Post>({ ...post, userId });
    }

    async findAll(): Promise<Post[]> {
        return await this.postRepository.findAll<Post>({
            include: [{ model: User, as: 'author', attributes: [[literal("CONCAT(first_name, ' ', last_name)"), 'name'], 'email', [literal("profile_img"), 'profile']] }],
        });
    }

    async findOne(id): Promise<Post> {
        return await this.postRepository.findOne({
            where: { id },
            include: [
                { model: User, as: 'author', attributes: [[literal("CONCAT(first_name, ' ', last_name)"), 'name'], 'email', [literal("profile_img"), 'profile']] },
                { model: Comment, as: 'comments' }],
        });
    }

    async delete(id, userId) {
        return await this.postRepository.destroy({ where: { id, userId } });
    }

    async update(id, data, userId) {
        const [numberOfAffectedRows, [updatedPost]] = await this.postRepository.update({ ...data }, { where: { id, userId }, returning: true });

        return { numberOfAffectedRows, updatedPost };
    }
}