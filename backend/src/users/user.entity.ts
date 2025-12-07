import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Listing } from '../listings/listing.entity';
import { Booking } from '../bookings/booking.entity';
import { Wishlist } from '../wishlists/wishlist.entity';
import { UserProfile } from './entities/user-profile.entity';

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

    @OneToMany(() => Listing, (listing) => listing.host)
    listings: Listing[];

    @OneToMany(() => Booking, (booking) => booking.guest)
    bookings: Booking[];

    @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
    wishlists: Wishlist[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => UserProfile, (profile) => profile.user)
    profile: UserProfile;
}

