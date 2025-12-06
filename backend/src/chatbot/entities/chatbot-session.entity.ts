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
import { User } from '../../users/user.entity';

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

    @Column({ type: 'uuid', nullable: false })
    user_id: string;

    @ManyToOne(() => Chatbot, (chatbot) => chatbot.sessions, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'chatbot_id' })
    chatbot: Chatbot;

    @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => ChatbotLog, (log) => log.session)
    logs: ChatbotLog[];

    @OneToMany(() => ChatMessage, (message) => message.session)
    messages: ChatMessage[];
}
