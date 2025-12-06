import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Room } from '../../listings/entities/room.entity';
import { User } from '../../users/user.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('increment')
    review_id: number;

    @Column({ type: 'text', nullable: false })
    content_text: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @Column({ type: 'text', nullable: true })
    status: string;

    @Column({ type: 'int', nullable: true })
    star_point: number;

    @Column({ type: 'int', nullable: false })
    room_id: number;

    @Column({ type: 'uuid', nullable: false })
    user_id: string;

    @ManyToOne(() => Room, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'room_id' })
    room: Room;

    @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    author: User;
}
