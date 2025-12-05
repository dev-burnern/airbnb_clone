import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
    @ApiProperty({ description: '메시지 내용' })
    @IsNotEmpty()
    @IsString()
    content: string;
}
