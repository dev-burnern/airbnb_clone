import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
    constructor(private paymentsService: PaymentsService) { }

    @Post(':bookingId/confirm')
    async confirm(@Param('bookingId') bookingId: string, @Body() paymentData: any) {
        return this.paymentsService.confirmPayment(bookingId, paymentData);
    }

    @Post(':bookingId/cancel')
    async cancel(@Param('bookingId') bookingId: string) {
        return this.paymentsService.cancelBooking(bookingId);
    }
}
