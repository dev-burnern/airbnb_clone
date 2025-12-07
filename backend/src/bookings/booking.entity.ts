import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Listing } from '../listings/listing.entity';

export enum BookingStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CONFIRMED = 'CONFIRMED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED'
}

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    checkIn: Date;

    @Column({ type: 'date' })
    checkOut: Date;

    @Column('int')
    guestCount: number;

    @Column('decimal', { precision: 12, scale: 2, nullable: true, default: 0 })
    totalPrice: number;

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING
    })
    status: BookingStatus;

    @ManyToOne(() => User, user => user.bookings)
    guest: User;

    @ManyToOne(() => Listing, listing => listing.bookings) // This might error if Listing doesn't have bookings property yet
    listing: Listing;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
