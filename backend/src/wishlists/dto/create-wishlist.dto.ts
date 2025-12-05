import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWishlistDto {
    @ApiProperty({
        example: '제주 여행',
        description: '위시리스트 이름',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;
}
