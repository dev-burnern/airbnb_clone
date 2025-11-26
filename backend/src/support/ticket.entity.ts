import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';

export enum TicketStatus {
    OPEN = 'OPEN',
    ASSIGNED = 'ASSIGNED',
    RESOLVED = 'RESOLVED'
}

@Entity('support_tickets')
export class SupportTicket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    subject: string;

    @Column('text')
    description: string;

    @Column({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.OPEN
    })
    status: TicketStatus;

    @Column({ nullable: true })
    priority: string; // LOW, MEDIUM, HIGH

    @Column({ nullable: true })
    category: string;

    @ManyToOne(() => User, user => user.tickets) // User who created the ticket
    user: User;

    @ManyToOne(() => User, user => user.assignedTickets, { nullable: true }) // Agent assigned
    assignedAgent: User;

    @OneToMany(() => TicketMessage, message => message.ticket)
    messages: TicketMessage[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity('ticket_messages')
export class TicketMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => SupportTicket, ticket => ticket.messages)
    ticket: SupportTicket;

    @ManyToOne(() => User)
    sender: User; // User or Agent

    @Column('text')
    content: string;

    @CreateDateColumn()
    createdAt: Date;
}
