import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Listing } from '../listings/listing.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int')
    cleanliness: number;

    @Column('int')
    accuracy: number;

    @Column('int')
    communication: number;

    @Column('int')
    location: number;

    @Column('int')
    checkin: number;

    @Column('int')
    value: number;

    @Column('text')
    comment: string;

    @Column('text', { nullable: true })
    hostReply: string;

    @ManyToOne(() => User, user => user.reviews) // Need to add reviews to User
    author: User;

    @ManyToOne(() => Listing, listing => listing.reviews) // Need to add reviews to Listing
    listing: Listing;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
