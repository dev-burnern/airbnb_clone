import { Controller, Request, Post, UseGuards, Get, Req, Res, Body } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    @ApiOperation({ summary: '이메일과 비밀번호로 로그인' })
    @ApiResponse({ status: 200, description: 'JWT 액세스 토큰 반환' })
    async login(@Body() loginDto: LoginDto, @Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register')
    @ApiOperation({ summary: '새 사용자 등록' })
    @ApiResponse({ status: 201, description: '사용자가 성공적으로 생성되었습니다.' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    @ApiOperation({ summary: '현재 사용자 프로필 조회' })
    @ApiResponse({ status: 200, description: '현재 사용자 프로필 반환' })
    getProfile(@Request() req) {
        return req.user;
    }

    @Get('github')
    @UseGuards(AuthGuard('github'))
    @ApiOperation({ summary: 'GitHub OAuth 로그인 시작' })
    async githubLogin() {
        // Initiates the GitHub OAuth flow
    }

    @Get('github/callback')
    @UseGuards(AuthGuard('github'))
    @ApiOperation({ summary: 'GitHub OAuth 콜백 처리' })
    async githubLoginCallback(@Req() req, @Res() res) {
        const jwt = await this.authService.login(req.user);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/?token=${jwt.access_token}`);
    }
}
