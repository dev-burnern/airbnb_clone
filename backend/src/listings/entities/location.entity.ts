import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn('uuid')
    location_id: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    location_name: string;

    @Column({ type: 'text', nullable: false })
    description_location: string;

    @Column({ type: 'text', nullable: false })
    description_traffic: string;

    @Column({ type: 'double precision', nullable: true })
    lat: number;

    @Column({ type: 'double precision', nullable: true })
    lng: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    neighbourhood: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    neighbourhood_group: string;
}
