import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Listing } from '../listings/listing.entity';
import { Booking } from '../bookings/booking.entity';
import { Review } from '../reviews/review.entity';
import { Wishlist } from '../wishlists/wishlist.entity';
import { SupportTicket } from '../support/ticket.entity';
import { ChatRoom } from '../chat/chat.entity';

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

    @Column({ type: 'simple-array' })
    roles: string[] = ['guest'];

    @Column({ type: 'enum', enum: ['local', 'google', 'naver'], default: 'local' })
    provider: string;

    @OneToMany(() => Listing, listing => listing.host)
    listings: Listing[];

    @OneToMany(() => Booking, booking => booking.guest)
    bookings: Booking[];

    @OneToMany(() => Review, review => review.author)
    reviews: Review[];

    @OneToMany(() => Wishlist, wishlist => wishlist.user)
    wishlists: Wishlist[];

    @OneToMany(() => SupportTicket, ticket => ticket.user)
    tickets: SupportTicket[];

    @OneToMany(() => SupportTicket, ticket => ticket.assignedAgent)
    assignedTickets: SupportTicket[];

    @OneToMany(() => ChatRoom, chatRoom => chatRoom.host)
    chatRoomsAsHost: ChatRoom[];

    @OneToMany(() => ChatRoom, chatRoom => chatRoom.guest)
    chatRoomsAsGuest: ChatRoom[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
