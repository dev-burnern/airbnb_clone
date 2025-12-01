import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Chatbot } from './chatbot.entity';
import { ChatbotLog } from './chatbot-log.entity';
import { ChatMessage } from './chatbot-message.entity';

@Entity('chatbot_session')
export class ChatbotSession {
    @PrimaryGeneratedColumn('increment')
    session_id: number;

    @Column({ type: 'timestamp', nullable: false })
    started_at: Date;

    @Column({ type: 'timestamp', nullable: false })
    ended_at: Date;

    @Column({ type: 'text', nullable: true })
    status: string;

    @Column({ type: 'int', nullable: false })
    chatbot_id: number;

    @Column({ type: 'int', nullable: false })
    user_id: number;

    @ManyToOne(() => Chatbot, (chatbot) => chatbot.sessions, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'chatbot_id' })
    chatbot: Chatbot;

    @OneToMany(() => ChatbotLog, (log) => log.session)
    logs: ChatbotLog[];

    @OneToMany(() => ChatMessage, (message) => message.session)
    messages: ChatMessage[];
}
