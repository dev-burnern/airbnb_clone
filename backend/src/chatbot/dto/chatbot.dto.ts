import { IsString, IsOptional, IsArray } from 'class-validator';

export class ChatDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsArray()
  history?: { role: string; content: string }[];
}
