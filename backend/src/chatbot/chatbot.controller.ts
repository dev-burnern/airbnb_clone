import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatDto } from './dto/chatbot.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  async chat(@Body() body: ChatDto) {
    const answer = await this.chatbotService.handleChat(body.message, body.history);
    return { answer };
  }
}
