import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('conversations')
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    title: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'participant1Id' })
    participant1: User;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'participant2Id' })
    participant2: User;

    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    lastMessageAt: Date;
}

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Conversation, conversation => conversation.messages)
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;

    @Column()
    conversationId: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @Column('text')
    content: string;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
