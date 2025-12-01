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
    @PrimaryGeneratedColumn('increment')
    room_id: number;

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

    @Column({ type: 'int', nullable: false })
    location_id: number;

    @ManyToOne(() => RoomType, { nullable: false })
    @JoinColumn({ name: 'room_types_id' })
    roomType: RoomType;

    @Column({ type: 'int', nullable: false })
    room_types_id: number;

    @ManyToOne(() => RoomOption, { nullable: false })
    @JoinColumn({ name: 'room_option_id' })
    roomOption: RoomOption;

    @Column({ type: 'int', nullable: false })
    room_option_id: number;

    @ManyToOne(() => Category, { nullable: false })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'int', nullable: false })
    category_id: number;

    @OneToMany(() => RoomImage, (image) => image.room)
    images: RoomImage[];
}
