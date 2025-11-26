import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { Listing } from '../listings/listing.entity';
import { User } from '../users/user.entity';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        @InjectRepository(Listing)
        private listingsRepository: Repository<Listing>,
        private dataSource: DataSource,
    ) { }

    async createBooking(user: User, createBookingDto: any): Promise<Booking> {
        const { listingId, checkIn, checkOut, guestCount } = createBookingDto;

        // Start transaction
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const listing = await this.listingsRepository.findOne({ where: { id: listingId } });
            if (!listing) {
                throw new BadRequestException('Listing not found');
            }

            // Check availability (Simplified overlap check)
            const overlappingBooking = await this.bookingsRepository
                .createQueryBuilder('booking')
                .where('booking.listingId = :listingId', { listingId })
                .andWhere('booking.status IN (:...statuses)', { statuses: [BookingStatus.CONFIRMED, BookingStatus.PAID] })
                .andWhere('booking.checkIn < :checkOut AND booking.checkOut > :checkIn', { checkIn, checkOut })
                .getOne();

            if (overlappingBooking) {
                throw new BadRequestException('Dates are not available');
            }

            // Calculate Price (Enhanced logic)
            const days = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24);
            const basePrice = listing.basePrice * days;
            const cleaningFee = 50; // Mock cleaning fee
            const serviceFee = basePrice * 0.15; // 15% service fee
            const totalPrice = basePrice + cleaningFee + serviceFee;

            const booking = this.bookingsRepository.create({
                listing,
                guest: user,
                checkIn,
                checkOut,
                guestCount,
                totalPrice,
                status: BookingStatus.PENDING,
            });

            const savedBooking = await queryRunner.manager.save(booking);
            await queryRunner.commitTransaction();
            return savedBooking;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(user: User): Promise<Booking[]> {
        return this.bookingsRepository.find({
            where: { guest: { id: user.id } },
            relations: ['listing'],
        });
    }
}
