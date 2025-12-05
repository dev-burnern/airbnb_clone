import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddListingDto {
    @ApiProperty({
        example: 'uuid-of-listing',
        description: '추가할 숙소 ID',
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    listingId: string;
}
