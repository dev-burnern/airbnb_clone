import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Booking } from '../bookings/booking.entity';
import { Review } from '../reviews/review.entity';
import { ChatRoom } from '../chat/chat.entity';
// import { Booking } from '../bookings/booking.entity'; // Circular dependency, will uncomment later or handle now if file exists
// import { Review } from '../reviews/review.entity';

@Entity('listings')
export class Listing {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    type: string; // apartment, house, etc.

    @Column()
    address: string;

    @Column('decimal', { precision: 10, scale: 6 })
    latitude: number;

    @Column('decimal', { precision: 10, scale: 6 })
    longitude: number;

    @Column('simple-array')
    images: string[];

    @Column('json')
    amenities: string[]; // Or detailed object

    @Column('int')
    maxGuests: number;

    @Column('int')
    basePrice: number;

    @Column('int', { nullable: true })
    weekendPrice: number;

    @Column('boolean', { default: false })
    smartPricingEnabled: boolean;

    @Column('json', { nullable: true })
    priceConfig: {
        weekday: number;
        weekend: number;
        extraGuest: number;
    };

    @ManyToOne(() => User, user => user.listings)
    host: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Booking, booking => booking.listing)
    bookings: Booking[];

    @OneToMany(() => Review, review => review.listing)
    reviews: Review[];

    @OneToMany(() => ChatRoom, chatRoom => chatRoom.listing)
    chatRooms: ChatRoom[];
}
