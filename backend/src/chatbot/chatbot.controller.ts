import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatDto } from './dto/chatbot.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) { }

  @Post()
  @ApiOperation({ summary: 'AI 챗봇과 대화' })
  async chat(@Body() body: ChatDto) {
    const answer = await this.chatbotService.handleChat(body.message, body.history);
    return { answer };
  }
}
