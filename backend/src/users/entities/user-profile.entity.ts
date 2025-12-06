import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../user.entity';


@Entity('user_profile')
export class UserProfile {
    @PrimaryGeneratedColumn('increment')
    profile_id: number;

    @Column({ type: 'uuid', unique: true, nullable: false })
    user_id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    image_name: string;

    @Column({ type: 'text', nullable: false })
    path: string;

    @Column({ type: 'text', nullable: true })
    introduction_text: string;

    @Column({ type: 'text', nullable: false })
    location: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    language: string;

    @Column({ type: 'text', nullable: true })
    job: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @Column({ type: 'text', nullable: true })
    status: string;

    @OneToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
