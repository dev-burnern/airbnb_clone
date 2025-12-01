import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';

@Entity('room_images')
export class RoomImage {
    @PrimaryGeneratedColumn('increment')
    image_id: number;

    @Column({ type: 'int', nullable: false })
    room_id: number;

    @Column({ type: 'varchar', length: 200, nullable: false })
    image_name: string;

    @Column({ type: 'text', nullable: false })
    path: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @Column({ type: 'text', nullable: true })
    status: string;

    @ManyToOne(() => Room, (room) => room.images, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'room_id' })
    room: Room;
}
