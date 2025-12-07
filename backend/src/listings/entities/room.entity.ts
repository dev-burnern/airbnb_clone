import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Location } from './location.entity';
import { RoomType } from './room-type.entity';
import { RoomOption } from './room-option.entity';
import { Category } from './category.entity';
import { RoomImage } from './room-image.entity';

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn('uuid')
    room_id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    room_name: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    room_address: string;

    @Column({ type: 'int', nullable: false })
    room_price: number;

    @Column({ type: 'int', nullable: false, default: 0 })
    room_wishes: number;

    @Column({ type: 'text', nullable: true })
    room_description: string;

    @Column({ type: 'time', nullable: false })
    check_in_time: string;

    @Column({ type: 'time', nullable: false })
    check_out_time: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @Column({ type: 'text', nullable: true })
    status: string;

    // Relationships
    @ManyToOne(() => Location, { nullable: false })
    @JoinColumn({ name: 'location_id' })
    location: Location;

    @Column({ type: 'uuid', nullable: false })
    location_id: string;

    @ManyToOne(() => RoomType, { nullable: false })
    @JoinColumn({ name: 'room_types_id' })
    roomType: RoomType;

    @Column({ type: 'uuid', nullable: false })
    room_types_id: string;

    @ManyToOne(() => RoomOption, { nullable: false })
    @JoinColumn({ name: 'room_option_id' })
    roomOption: RoomOption;

    @Column({ type: 'uuid', nullable: false })
    room_option_id: string;

    @ManyToOne(() => Category, { nullable: false })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'uuid', nullable: false })
    category_id: string;

    @OneToMany(() => RoomImage, (image) => image.room)
    images: RoomImage[];
}
