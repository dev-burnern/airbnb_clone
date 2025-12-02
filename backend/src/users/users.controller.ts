import { Controller, Get, Request, UseGuards, Patch, Body, Post, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Return current user profile.' })
    getProfile(@Request() req) {
        return this.usersService.findOneById(req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('me')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
    async updateProfile(@Request() req, @Body() updateData: any) {
        // TODO: Create UpdateUserDto
        return this.usersService.update(req.user.id, updateData);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('me')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete current user account' })
    @ApiResponse({ status: 204, description: 'Account deleted successfully.' })
    async deleteAccount(@Request() req) {
        await this.usersService.delete(req.user.id);
        return;
    }

    @Post('check-email')
    @ApiOperation({ summary: 'Check if email already exists' })
    @ApiResponse({ status: 200, description: 'Return whether email exists.' })
    async checkEmail(@Body('email') email: string) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.usersService.findOneByEmail(normalizedEmail);
        return { exists: !!user };
    }
}
