import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findOneByGithubId(githubId: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { githubId } });
    }

    async findOneById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            relations: ['profile']
        });
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }

    async update(id: string, updateData: Partial<User>): Promise<User> {
        await this.usersRepository.update(id, updateData);
        const user = await this.findOneById(id);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다');
        }
        return user;
    }

    async delete(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
