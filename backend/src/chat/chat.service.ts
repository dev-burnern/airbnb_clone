import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, Message } from './entities/chat.entity';
import { User } from '../users/user.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createConversation(user: User, dto: CreateConversationDto): Promise<Conversation> {
        const participant = await this.userRepository.findOne({ where: { id: dto.participantId } });
        if (!participant) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        if (user.id === dto.participantId) {
            throw new BadRequestException('자기 자신과 대화할 수 없습니다.');
        }

        // 이미 존재하는 대화방 확인
        const existing = await this.conversationRepository
            .createQueryBuilder('conv')
            .where('(conv.participant1Id = :userId AND conv.participant2Id = :participantId)', { userId: user.id, participantId: dto.participantId })
            .orWhere('(conv.participant1Id = :participantId AND conv.participant2Id = :userId)', { userId: user.id, participantId: dto.participantId })
            .getOne();

        if (existing) {
            return existing;
        }

        const conversation = this.conversationRepository.create({
            participant1: user,
            participant2: participant,
            title: dto.title || `${user.name}님과 ${participant.name}님의 대화`,
        });

        return this.conversationRepository.save(conversation);
    }

    async findUserConversations(user: User): Promise<Conversation[]> {
        return this.conversationRepository
            .createQueryBuilder('conv')
            .leftJoinAndSelect('conv.participant1', 'p1')
            .leftJoinAndSelect('conv.participant2', 'p2')
            .where('conv.participant1Id = :userId', { userId: user.id })
            .orWhere('conv.participant2Id = :userId', { userId: user.id })
            .orderBy('conv.lastMessageAt', 'DESC')
            .getMany();
    }

    async findConversationById(id: string, user: User): Promise<Conversation> {
        const conversation = await this.conversationRepository
            .createQueryBuilder('conv')
            .leftJoinAndSelect('conv.participant1', 'p1')
            .leftJoinAndSelect('conv.participant2', 'p2')
            .leftJoinAndSelect('conv.messages', 'messages')
            .leftJoinAndSelect('messages.sender', 'sender')
            .where('conv.id = :id', { id })
            .andWhere('(conv.participant1Id = :userId OR conv.participant2Id = :userId)', { userId: user.id })
            .orderBy('messages.createdAt', 'ASC')
            .getOne();

        if (!conversation) {
            throw new NotFoundException('대화방을 찾을 수 없습니다.');
        }

        return conversation;
    }

    async createMessage(conversationId: string, user: User, dto: CreateMessageDto): Promise<Message> {
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId },
        });

        if (!conversation) {
            throw new NotFoundException('대화방을 찾을 수 없습니다.');
        }

        const message = this.messageRepository.create({
            conversation,
            conversationId,
            sender: user,
            content: dto.content,
        });

        const savedMessage = await this.messageRepository.save(message);

        // 마지막 메시지 시간 업데이트
        await this.conversationRepository.update(conversationId, { lastMessageAt: new Date() });

        return savedMessage;
    }

    async getConversationMessages(conversationId: string, user: User): Promise<Message[]> {
        const conversation = await this.findConversationById(conversationId, user);
        return conversation.messages || [];
    }

    async markMessagesAsRead(conversationId: string, user: User): Promise<void> {
        await this.messageRepository
            .createQueryBuilder()
            .update(Message)
            .set({ isRead: true })
            .where('conversationId = :conversationId', { conversationId })
            .andWhere('senderId != :userId', { userId: user.id })
            .execute();
    }
}
