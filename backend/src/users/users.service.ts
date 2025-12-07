import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserProfile } from './entities/user-profile.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(UserProfile)
        private userProfileRepository: Repository<UserProfile>,
    ) { }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email }, relations: ['profile'] });
    }

    async findOneByGithubId(githubId: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { githubId }, relations: ['profile'] });
    }

    async findOneById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            relations: ['profile']
        });
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.usersRepository.create(userData);
        const savedUser = await this.usersRepository.save(user);

        // Create default profile
        const profile = this.userProfileRepository.create({
            user_id: savedUser.id,
            image_name: 'default.jpg',
            path: userData.avatarUrl || 'https://placehold.co/100',
            location: '',
            language: '한국어',
            job: '',
            introduction_text: '',
            status: 'active'
        });
        await this.userProfileRepository.save(profile);

        const createdUser = await this.findOneById(savedUser.id);
        if (!createdUser) {
            throw new NotFoundException('사용자 생성 후 조회 실패');
        }
        return createdUser;
    }

    async update(id: string, updateData: any): Promise<User> {
        const user = await this.findOneById(id);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다');
        }

        // Separate fields
        const userFields = ['name', 'avatarUrl', 'email', 'password'];
        const userUpdateData = {};
        const profileUpdateData = {};

        Object.keys(updateData).forEach(key => {
            if (userFields.includes(key)) {
                userUpdateData[key] = updateData[key];
            } else {
                profileUpdateData[key] = updateData[key];
            }
        });

        // Update User entity
        if (Object.keys(userUpdateData).length > 0) {
            await this.usersRepository.update(id, userUpdateData);
        }

        // Update UserProfile entity
        if (Object.keys(profileUpdateData).length > 0) {
            let profile = user.profile;
            if (!profile) {
                profile = this.userProfileRepository.create({
                    user_id: id,
                    image_name: 'default.jpg',
                    path: user.avatarUrl || 'https://placehold.co/100',
                    location: '',
                    language: '한국어',
                    job: '',
                    introduction_text: '',
                    status: 'active'
                });
                await this.userProfileRepository.save(profile);
            }

            // Map frontend fields to DB fields if necessary
            if (profileUpdateData['introduction']) {
                profileUpdateData['introduction_text'] = profileUpdateData['introduction'];
                delete profileUpdateData['introduction'];
            }
            if (profileUpdateData['profileImage']) {
                profileUpdateData['path'] = profileUpdateData['profileImage'];
                delete profileUpdateData['profileImage'];
            }

            await this.userProfileRepository.update(profile.profile_id, profileUpdateData);
        }

        const updatedUser = await this.findOneById(id);
        if (!updatedUser) {
            throw new NotFoundException('사용자 수정 후 조회 실패');
        }
        return updatedUser;
    }

    async delete(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
