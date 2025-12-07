import { IsNotEmpty, IsUUID, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
    @ApiProperty({ description: '대화 상대방 ID' })
    @IsNotEmpty()
    @IsUUID()
    participantId: string;

    @ApiProperty({ description: '대화방 제목 (선택)', required: false })
    @IsOptional()
    @IsString()
    title?: string;
}
