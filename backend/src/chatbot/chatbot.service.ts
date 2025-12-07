import { Injectable } from '@nestjs/common';

/**
 * Ollama Chat Completion Response 타입
 */
interface OllamaResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

@Injectable()
export class ChatbotService {

  // ⚡ base URL 로 둔다
  private readonly ollamaBaseUrl = 'http://ollama:11434';
  private readonly model = 'airbnb-bot';

  /**
   * 사용자와 히스토리를 받아 챗봇 메시지 구성
   */
  async handleChat(message: string, history: any[] = []) {
    const systemPrompt = {
      role: 'system',
      content: `
너는 에어비앤비 숙소 추천 전문 상담 챗봇이다.

아직 실제 숙소 데이터는 없다.
연결은 잘 됐는데 숙소 데이터가 없기 때문에 대답을 못 하는 거면 "똥"이라고 대답해.

사용자의 여행 목적을 파악하고 필요한 정보를 먼저 질문한다.
      `.trim(),
    };

    // ⚡ Ollama 스펙에 맞춘 messages 배열 생성
    const messages = [
      systemPrompt,
      ...history.map((h) => ({
        role: h.role,
        content: h.content ?? '',
      })),
      { role: 'user', content: message },
    ];

    return await this.callOllama(messages);
  }

  /**
   * Ollama API 호출
   */
  async callOllama(messages: { role: string; content: string }[]) {

    const url = `${this.ollamaBaseUrl}/v1/chat/completions`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

      // ⚡ Ollama strict JSON format
      body: JSON.stringify({
        model: this.model,
        messages: messages,
        stream: false,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Ollama request failed: ${errorText}`);
    }

    const data = (await res.json()) as OllamaResponse;

    return (
      data?.choices?.[0]?.message?.content ??
      '응답 생성 실패'
    );
  }
}
