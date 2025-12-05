import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { Wishlist } from './wishlist.entity';
import { Listing } from '../listings/listing.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Wishlist, Listing])],
    providers: [WishlistsService],
    controllers: [WishlistsController],
    exports: [WishlistsService],
})
export class WishlistsModule { }
