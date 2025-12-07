import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
    constructor(private chatService: ChatService) { }

    @Get('conversations')
    @ApiOperation({ summary: '내 대화방 목록 조회' })
    async findMyConversations(@Request() req) {
        return this.chatService.findUserConversations(req.user);
    }

    @Post('conversations')
    @ApiOperation({ summary: '새 대화방 생성' })
    async createConversation(@Request() req, @Body() dto: CreateConversationDto) {
        const conversation = await this.chatService.createConversation(req.user, dto);
        // 순환 참조 방지를 위해 필요한 필드만 반환
        return {
            id: conversation.id,
            title: conversation.title,
            createdAt: conversation.createdAt,
            lastMessageAt: conversation.lastMessageAt,
        };
    }

    @Get('conversations/:id')
    @ApiOperation({ summary: '대화방 상세 및 메시지 조회' })
    async findConversation(@Request() req, @Param('id') id: string) {
        return this.chatService.findConversationById(id, req.user);
    }

    @Post('conversations/:id/messages')
    @ApiOperation({ summary: '메시지 전송' })
    async sendMessage(
        @Request() req,
        @Param('id') id: string,
        @Body() dto: CreateMessageDto,
    ) {
        return this.chatService.createMessage(id, req.user, dto);
    }

    @Post('conversations/:id/read')
    @ApiOperation({ summary: '메시지 읽음 처리' })
    async markAsRead(@Request() req, @Param('id') id: string) {
        await this.chatService.markMessagesAsRead(id, req.user);
        return { success: true };
    }
}
