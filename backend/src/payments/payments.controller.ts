import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
    constructor(private paymentsService: PaymentsService) { }

    @Post('toss/verify')
    @ApiOperation({ summary: '토스페이먼츠 결제 검증' })
    async verifyTossPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
        console.log('토스 결제 검증 요청:', confirmPaymentDto);
        return this.paymentsService.verifyTossPayment(confirmPaymentDto);
    }

    @Post(':bookingId/confirm')
    @ApiOperation({ summary: '예약 결제 확정' })
    @UseGuards(AuthGuard('jwt'))
    async confirm(@Param('bookingId') bookingId: string, @Body() paymentData: any) {
        return this.paymentsService.confirmPayment(bookingId, paymentData);
    }

    @Post(':bookingId/cancel')
    @ApiOperation({ summary: '예약 취소' })
    @UseGuards(AuthGuard('jwt'))
    async cancel(@Param('bookingId') bookingId: string) {
        return this.paymentsService.cancelBooking(bookingId);
    }
}
