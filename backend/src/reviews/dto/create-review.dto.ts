import { IsString, IsNotEmpty, IsInt, Min, Max, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: '숙소 ID',
    })
    @IsUUID()
    @IsNotEmpty()
    listingId: string;

    @ApiProperty({
        example: '깨끗하고 위치가 좋았습니다. 호스트분도 친절하셨어요!',
        description: '리뷰 내용',
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        example: 5,
        description: '별점 (1-5)',
        minimum: 1,
        maximum: 5,
    })
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;
}
