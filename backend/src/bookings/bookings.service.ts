import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
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

    // 게스트용: 내 예약 목록
    async findAll(user: User): Promise<Booking[]> {
        return this.bookingsRepository.find({
            where: { guest: { id: user.id } },
            relations: ['listing', 'listing.host'],
            order: { checkIn: 'DESC' },
        });
    }

    // 호스트용: 내 숙소에 대한 모든 예약
    async findHostBookings(hostId: string): Promise<Booking[]> {
        return this.bookingsRepository
            .createQueryBuilder('booking')
            .innerJoinAndSelect('booking.listing', 'listing')
            .innerJoinAndSelect('booking.guest', 'guest')
            .where('listing.hostId = :hostId', { hostId })
            .orderBy('booking.checkIn', 'DESC')
            .getMany();
    }

    // 호스트용: 오늘 체크인/체크아웃 예약
    async findTodayBookings(hostId: string): Promise<Booking[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return this.bookingsRepository
            .createQueryBuilder('booking')
            .innerJoinAndSelect('booking.listing', 'listing')
            .innerJoinAndSelect('booking.guest', 'guest')
            .where('listing.hostId = :hostId', { hostId })
            .andWhere('booking.status IN (:...statuses)', {
                statuses: [BookingStatus.CONFIRMED, BookingStatus.PAID]
            })
            .andWhere('(booking.checkIn >= :today AND booking.checkIn < :tomorrow) OR (booking.checkOut >= :today AND booking.checkOut < :tomorrow)', {
                today: today.toISOString(),
                tomorrow: tomorrow.toISOString(),
            })
            .orderBy('booking.checkIn', 'ASC')
            .getMany();
    }

    // 호스트용: 예정된 예약 (오늘 이후)
    async findUpcomingBookings(hostId: string): Promise<Booking[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.bookingsRepository
            .createQueryBuilder('booking')
            .innerJoinAndSelect('booking.listing', 'listing')
            .innerJoinAndSelect('booking.guest', 'guest')
            .where('listing.hostId = :hostId', { hostId })
            .andWhere('booking.status IN (:...statuses)', {
                statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.PAID]
            })
            .andWhere('booking.checkIn >= :today', { today: today.toISOString() })
            .orderBy('booking.checkIn', 'ASC')
            .getMany();
    }

    // 호스트용: 예약 상태 변경
    async updateBookingStatus(bookingId: string, hostId: string, status: string): Promise<Booking> {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId },
            relations: ['listing', 'listing.host', 'guest'],
        });

        if (!booking) {
            throw new NotFoundException('예약을 찾을 수 없습니다.');
        }

        if (booking.listing.host.id !== hostId) {
            throw new ForbiddenException('이 예약을 수정할 권한이 없습니다.');
        }

        // 유효한 상태인지 확인
        const validStatuses = Object.values(BookingStatus);
        if (!validStatuses.includes(status as BookingStatus)) {
            throw new BadRequestException('유효하지 않은 상태입니다.');
        }

        booking.status = status as BookingStatus;
        return this.bookingsRepository.save(booking);
    }
}
