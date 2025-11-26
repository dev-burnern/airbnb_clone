export class ChatMessageDto {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class ChatRequestDto {
  messages: ChatMessageDto[];
}
