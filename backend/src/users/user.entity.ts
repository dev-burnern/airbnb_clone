import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ nullable: true })
    githubId?: string;

    @Column({ nullable: true })
    name?: string;

    @Column({ nullable: true })
    avatarUrl?: string;

    @Column({ type: 'simple-array', default: 'guest' })
    roles: string[] = ['guest'];

    @Column({ type: 'varchar', length: 50, default: 'local' })
    provider: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

