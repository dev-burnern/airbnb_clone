import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { ChatbotSession } from './chatbot-session.entity';
import { ChatbotLog } from './chatbot-log.entity';
import { ChatMessage } from './chatbot-message.entity';

@Entity('chatbot')
export class Chatbot {
    @PrimaryGeneratedColumn('increment')
    chatbot_id: number;

    @Column({ type: 'text', nullable: false })
    message: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    intent: string;

    @Column({ type: 'text', nullable: false })
    ai_answer: string;

    @Column({ type: 'int', nullable: false })
    ticket_id: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    email: string;

    @Column({ type: 'text', nullable: true })
    status: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @OneToMany(() => ChatbotSession, (session) => session.chatbot)
    sessions: ChatbotSession[];

    @OneToMany(() => ChatbotLog, (log) => log.chatbot)
    logs: ChatbotLog[];

    @OneToMany(() => ChatMessage, (message) => message.chatbot)
    messages: ChatMessage[];
}
