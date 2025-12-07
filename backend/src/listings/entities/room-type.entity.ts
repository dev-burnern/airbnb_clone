import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('room_types')
export class RoomType {
    @PrimaryGeneratedColumn('uuid')
    room_types_id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    types_name: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @Column({ type: 'text', nullable: true })
    status: string;
}
