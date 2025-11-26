import { Controller, Get, Request, UseGuards, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getProfile(@Request() req) {
        return this.usersService.findOneById(req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('me')
    async updateProfile(@Request() req, @Body() updateData: any) {
        // TODO: Create UpdateUserDto
        return this.usersService.update(req.user.id, updateData);
    }
}
