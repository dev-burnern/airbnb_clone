import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './booking.entity';
import { Listing } from '../listings/listing.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Booking, Listing])],
    providers: [BookingsService],
    controllers: [BookingsController],
    exports: [BookingsService],
})
export class BookingsModule { }
