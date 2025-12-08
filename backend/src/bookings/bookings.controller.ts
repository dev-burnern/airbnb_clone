import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class BookingsController {
    constructor(private bookingsService: BookingsService) { }

    @Post()
    @ApiOperation({ summary: '새 예약 생성' })
    async create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.createBooking(req.user, createBookingDto);
    }

    @Get()
    @ApiOperation({ summary: '내 예약 목록 조회 (게스트)' })
    async findAll(@Request() req) {
        return this.bookingsService.findAll(req.user);
    }

    @Get('host')
    @ApiOperation({ summary: '호스트용 예약 목록 조회' })
    async findHostBookings(@Request() req) {
        return this.bookingsService.findHostBookings(req.user.id);
    }

    @Get('host/today')
    @ApiOperation({ summary: '호스트용 오늘 예약 조회' })
    async findTodayBookings(@Request() req) {
        return this.bookingsService.findTodayBookings(req.user.id);
    }

    @Get('host/upcoming')
    @ApiOperation({ summary: '호스트용 예정된 예약 조회' })
    async findUpcomingBookings(@Request() req) {
        return this.bookingsService.findUpcomingBookings(req.user.id);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: '예약 상태 변경 (호스트)' })
    async updateStatus(
        @Param('id') id: string,
        @Request() req,
        @Body('status') status: string,
    ) {
        return this.bookingsService.updateBookingStatus(id, req.user.id, status);
    }
}
