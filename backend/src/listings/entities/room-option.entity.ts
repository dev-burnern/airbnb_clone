import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('room_options')
export class RoomOption {
    @PrimaryGeneratedColumn('uuid')
    room_option_id: string;

    @Column({ type: 'int', nullable: false })
    item1: number;

    @Column({ type: 'int', nullable: false })
    item2: number;

    @Column({ type: 'int', nullable: false })
    item3: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @Column({ type: 'text', nullable: true })
    status: string;
}
