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

@Entity('chat_messages')
export class ChatMessage {
    @PrimaryGeneratedColumn('increment')
    message_id: number;

    @Column({ type: 'text', nullable: false })
    message_text: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    message_type: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @Column({ type: 'boolean', nullable: true })
    is_read: boolean;

    @Column({ type: 'text', nullable: true })
    status: string;

    @Column({ type: 'int', nullable: false })
    session_id: number;

    @Column({ type: 'int', nullable: false })
    chatbot_id: number;

    @ManyToOne(() => ChatbotSession, (session) => session.messages, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'session_id' })
    session: ChatbotSession;

    @ManyToOne(() => Chatbot, (chatbot) => chatbot.messages, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'chatbot_id' })
    chatbot: Chatbot;
}
