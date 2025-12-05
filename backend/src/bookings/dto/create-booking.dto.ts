import { IsString, IsDateString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
    @ApiProperty({ example: 'uuid-of-listing', description: 'The ID of the listing to book' })
    @IsString()
    listingId: string;

    @ApiProperty({ example: '2025-01-01', description: 'Check-in date (YYYY-MM-DD)' })
    @IsDateString()
    checkIn: string;

    @ApiProperty({ example: '2025-01-05', description: 'Check-out date (YYYY-MM-DD)' })
    @IsDateString()
    checkOut: string;

    @ApiProperty({ example: 2, description: 'Number of guests' })
    @IsInt()
    @Min(1)
    guestCount: number;
}
