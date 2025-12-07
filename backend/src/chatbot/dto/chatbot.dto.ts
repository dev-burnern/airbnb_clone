// dto/chatbot.dto.ts

import { IsString, IsArray, IsOptional, ValidateNested, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class MessageDto {
  @ApiProperty({ 
    description: '메시지 역할',
    enum: ['user', 'assistant', 'system'],
    example: 'user'
  })
  @IsString()
  role: 'user' | 'assistant' | 'system';

  @ApiProperty({ 
    description: '메시지 내용',
    example: '서울에서 2인 숙소 추천해주세요'
  })
  @IsString()
  content: string;
}

export class ChatDto {
  @ApiProperty({ 
    description: '사용자 메시지',
    example: '강남역 근처 숙소 찾아줘',
    minLength: 1,
    maxLength: 1000
  })
  @IsString()
  @MinLength(1, { message: '메시지는 최소 1자 이상이어야 합니다.' })
  @MaxLength(1000, { message: '메시지는 1000자를 초과할 수 없습니다.' })
  message: string;

  @ApiProperty({ 
    description: '대화 히스토리 (선택사항)',
    type: [MessageDto],
    required: false,
    example: [
      { role: 'user', content: '안녕하세요' },
      { role: 'assistant', content: '안녕하세요! 무엇을 도와드릴까요?' }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  history?: MessageDto[];
}