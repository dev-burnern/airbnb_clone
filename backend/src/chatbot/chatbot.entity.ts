import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Listing } from '../listings/listing.entity';

@Entity('chat_rooms')
export class ChatRoom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.chatRoomsAsHost)
    host: User;

    @ManyToOne(() => User, user => user.chatRoomsAsGuest)
    guest: User;

    @ManyToOne(() => Listing, listing => listing.chatRooms)
    listing: Listing;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
