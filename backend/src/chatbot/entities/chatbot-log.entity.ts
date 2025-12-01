import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Chatbot } from './chatbot.entity';
import { ChatbotSession } from './chatbot-session.entity';

@Entity('chatbot_logs')
export class ChatbotLog {
    @PrimaryGeneratedColumn('increment')
    log_id: number;

    @Column({ type: 'text', nullable: false })
    request_text: string;

    @Column({ type: 'text', nullable: false })
    response_text: string;

    @Column({ type: 'text', nullable: false })
    response_status: string;

    @Column({ type: 'float', nullable: true })
    response_time: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @Column({ type: 'int', nullable: false })
    chatbot_id: number;

    @Column({ type: 'int', nullable: false })
    session_id: number;

    @ManyToOne(() => Chatbot, (chatbot) => chatbot.logs, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'chatbot_id' })
    chatbot: Chatbot;

    @ManyToOne(() => ChatbotSession, (session) => session.logs, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'session_id' })
    session: ChatbotSession;
}
