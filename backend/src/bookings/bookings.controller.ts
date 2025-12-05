import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
    constructor(private bookingsService: BookingsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new booking' })
    async create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.createBooking(req.user, createBookingDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get my bookings' })
    async findAll(@Request() req) {
        return this.bookingsService.findAll(req.user);
    }
}
