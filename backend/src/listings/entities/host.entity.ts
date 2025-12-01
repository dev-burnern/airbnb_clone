import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('hosts')
export class Host {
    @PrimaryGeneratedColumn('increment')
    host_id: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    host_name: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    identity_verified: string;

    @Column({ type: 'int', nullable: true })
    listing_count: number;
}
