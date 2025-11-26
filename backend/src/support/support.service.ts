import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket, TicketMessage, TicketStatus } from './ticket.entity';
import { User } from '../users/user.entity';

@Injectable()
export class SupportService {
    constructor(
        @InjectRepository(SupportTicket)
        private ticketRepository: Repository<SupportTicket>,
        @InjectRepository(TicketMessage)
        private messageRepository: Repository<TicketMessage>,
    ) { }

    async createTicket(user: User, subject: string, description: string): Promise<SupportTicket> {
        const ticket = this.ticketRepository.create({
            user,
            subject,
            description,
            status: TicketStatus.OPEN,
        });
        return this.ticketRepository.save(ticket);
    }

    async findAll(): Promise<SupportTicket[]> {
        return this.ticketRepository.find({ relations: ['user'] });
    }

    async findOne(id: string): Promise<SupportTicket | null> {
        return this.ticketRepository.findOne({ where: { id }, relations: ['messages', 'messages.sender'] });
    }

    async addMessage(ticketId: string, sender: User, content: string): Promise<TicketMessage> {
        const message = this.messageRepository.create({
            ticket: { id: ticketId },
            sender,
            content,
        });
        return this.messageRepository.save(message);
    }

    async assignTicket(ticketId: string, agentId: string): Promise<SupportTicket> {
        await this.ticketRepository.update(ticketId, {
            assignedAgent: { id: agentId },
            status: TicketStatus.ASSIGNED,
        });
        const ticket = await this.findOne(ticketId);
        if (!ticket) throw new Error('Ticket not found');
        return ticket;
    }

    async resolveTicket(ticketId: string): Promise<SupportTicket> {
        await this.ticketRepository.update(ticketId, {
            status: TicketStatus.RESOLVED,
        });
        const ticket = await this.findOne(ticketId);
        if (!ticket) throw new Error('Ticket not found');
        return ticket;
    }

    // Simplified Auto-Assignment (Randomly assigns to a hardcoded agent for MVP)
    // In real app, query users with role 'agent' and load balance
    async autoAssign(ticketId: string): Promise<SupportTicket> {
        // Mock Agent ID (You might need to create a user with this ID first or pick dynamic)
        // For MVP, we'll just skip actual assignment logic or assign to self if triggered by admin
        const ticket = await this.findOne(ticketId);
        if (!ticket) throw new Error('Ticket not found');
        return ticket;
    }
}
