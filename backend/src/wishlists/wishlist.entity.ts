import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';
import { Listing } from '../listings/listing.entity';

@Entity('wishlists')
export class Wishlist {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @ManyToOne(() => User, user => user.wishlists) // Need to add wishlists to User
    user!: User;

    @ManyToMany(() => Listing)
    @JoinTable({
        name: 'wishlists_listings_listing',
        joinColumn: {
            name: 'wishlistsId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'listingId',
            referencedColumnName: 'id',
        },
    })
    listings!: Listing[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

