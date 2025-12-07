import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UsersController } from './users.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserProfile])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule { }
