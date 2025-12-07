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

@Entity('reservation')
export class Reservation {
    @PrimaryGeneratedColumn('uuid')
    reservation_id: string;

    @Column({ type: 'timestamp', nullable: false })
    check_in_date: Date;

    @Column({ type: 'timestamp', nullable: false })
    check_out_date: Date;

    @Column({ type: 'int', nullable: true })
    adults: number;

    @Column({ type: 'int', nullable: true })
    childeren: number;

    @Column({ type: 'int', nullable: true })
    infants: number;

    @Column({ type: 'int', nullable: true })
    pets: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @Column({ type: 'text', nullable: true })
    status: string;

    @Column({ type: 'uuid', nullable: false })
    room_id: string;

    @ManyToOne(() => Room, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'room_id' })
    room: Room;
}
