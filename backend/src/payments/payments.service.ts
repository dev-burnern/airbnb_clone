import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../bookings/booking.entity';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';


@Injectable()
export class PaymentsService {
    private readonly TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;

    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
    ) { }

    async verifyTossPayment(confirmPaymentDto: ConfirmPaymentDto): Promise<any> {
        const { paymentKey, orderId, amount } = confirmPaymentDto;

        if (!this.TOSS_SECRET_KEY) {
            throw new InternalServerErrorException('TOSS_SECRET_KEY 환경변수가 설정되어 있지 않습니다.');
        }

        try {
            // 토스페이먼츠 결제 승인 API 호출
            const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${Buffer.from(this.TOSS_SECRET_KEY + ':').toString('base64')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentKey,
                    orderId,
                    amount,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Toss 결제 승인 실패 응답:', error); // 상세 에러 전체 출력
                throw new BadRequestException(`결제 승인 실패: ${error.message}`);
            }

            const paymentData = await response.json();
            return paymentData;
        } catch (error) {
            throw new BadRequestException(`결제 검증 실패: ${error.message}`);
        }
    }

    async confirmPayment(bookingId: string, paymentData: any): Promise<Booking> {
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
