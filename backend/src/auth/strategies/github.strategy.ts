import { Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(
        configService: ConfigService,
        private authService: AuthService,
    ) {
        const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
        super({
            clientID: configService.get<string>('GITHUB_CLIENT_ID', 'client_id'),
            clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET', 'client_secret'),
            callbackURL: `http://localhost:3001/${apiPrefix}/auth/github/callback`,
            scope: ['user:email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
        const { id, username, emails, photos } = profile;
        const user = {
            githubId: id,
            email: emails[0].value,
            name: username,
            avatarUrl: photos[0].value,
            accessToken,
        };
        const payload = await this.authService.validateGithubUser(user);
        done(null, payload);
    }
}
