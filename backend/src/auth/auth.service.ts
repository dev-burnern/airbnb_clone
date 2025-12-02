import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.usersService.findOneByEmail(normalizedEmail);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async register(registerDto: any) {
        const email = registerDto.email.trim().toLowerCase();
        const existingUser = await this.usersService.findOneByEmail(email);
        if (existingUser) {
            throw new ConflictException('이미 존재하는 이메일입니다');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.usersService.create({
            ...registerDto,
            email,
            password: hashedPassword,
            provider: 'local',
        });

        const { password, ...result } = user;
        return result;
    }

    async validateGithubUser(details: { email: string; name: string; avatarUrl: string; githubId: string; accessToken: string }) {
        let user = await this.usersService.findOneByGithubId(details.githubId);
        if (!user) {
            user = await this.usersService.findOneByEmail(details.email);
        }

        if (user) {
            user.githubId = details.githubId;
            user.avatarUrl = details.avatarUrl;
            await this.usersService.create(user); // Update existing user
            return user;
        }

        return this.usersService.create({
            email: details.email,
            name: details.name,
            avatarUrl: details.avatarUrl,
            githubId: details.githubId,
        });
    }
}
