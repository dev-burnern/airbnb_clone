// chatbot.controller.ts

import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatDto } from './dto/chatbot.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) { }

  @Post()
  @ApiOperation({ summary: 'AI 챗봇과 대화' })
  @ApiResponse({ 
    status: 200, 
    description: '챗봇 응답 성공',
    schema: {
      example: {
        answer: '안녕하세요! 어떤 숙소를 찾으시나요?'
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: '서버 오류 또는 Ollama 연결 실패' 
  })
  @ApiResponse({ 
    status: 408, 
    description: '응답 시간 초과' 
  })
  async chat(@Body() body: ChatDto) {
    try {
      console.log('📥 챗봇 요청:', {
        message: body.message,
        historyLength: body.history?.length || 0
      });

      const startTime = Date.now();
      const result = await this.chatbotService.handleChat(
        body.message, 
        body.history
      );
      const duration = Date.now() - startTime;

      console.log('📤 챗봇 응답:', {
        answerLength: result.answer.length,
        duration: `${(duration / 1000).toFixed(2)}초`
      });

      // ⚡ 프론트엔드와 일치하는 단순한 구조로 반환
      return { answer: result.answer };

    } catch (error) {
      console.error('❌ 챗봇 오류:', error);

      // Ollama 연결 오류
      if (error.message?.includes('fetch failed') || 
          error.message?.includes('ECONNREFUSED')) {
        throw new HttpException(
          'Ollama 서버에 연결할 수 없습니다. 서버 상태를 확인해주세요.',
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }

      // 타임아웃 오류
      if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        throw new HttpException(
          '응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
          HttpStatus.REQUEST_TIMEOUT
        );
      }

      // 기타 오류
      throw new HttpException(
        error.message || '챗봇 응답 생성 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}