import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../bookings/booking.entity';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
    ) { }

    async confirmPayment(bookingId: string, paymentData: any): Promise<Booking> {
        // Mock PG Verification
        // In real world, verify payment with PG API using paymentData.paymentKey
        const isPaymentValid = true;

        if (!isPaymentValid) {
            throw new BadRequestException('Payment verification failed');
        }

        const booking = await this.bookingsRepository.findOne({ where: { id: bookingId } });
        if (!booking) {
            throw new BadRequestException('Booking not found');
        }

        if (booking.status !== BookingStatus.PENDING) {
            throw new BadRequestException('Booking is not pending payment');
        }

        booking.status = BookingStatus.PAID;
        // Store payment details if needed (e.g. transaction ID)

        return this.bookingsRepository.save(booking);
    }
    async cancelBooking(bookingId: string): Promise<Booking> {
        const booking = await this.bookingsRepository.findOne({ where: { id: bookingId } });
        if (!booking) {
            throw new BadRequestException('Booking not found');
        }

        if (booking.status === BookingStatus.CANCELLED) {
            throw new BadRequestException('Booking is already cancelled');
        }

        // Refund logic (Mock)
        // In real world, call PG API to refund payment

        booking.status = BookingStatus.CANCELLED;
        return this.bookingsRepository.save(booking);
    }
}
