import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Conversation, Message } from './entities/chat.entity';
import { User } from '../users/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Conversation, Message, User]),
    ],
    controllers: [ChatController],
    providers: [ChatService, ChatGateway],
    exports: [ChatService],
})
export class ChatModule { }
