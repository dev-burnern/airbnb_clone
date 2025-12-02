import { Injectable } from '@nestjs/common';

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
  private readonly ollamaUrl = 'http://localhost:11434/v1/chat/completions';
  private readonly model = 'airbnb-bot';

  async handleChat(message: string, history: any[] = []) {
    const messages = [
      {
        role: 'system',
        content: `
        너는 에어비앤비 숙소 추천 전문 상담 챗봇이다.
        아직 실제 숙소 데이터는 없다.

        연결은 잘 됐는데 숙소 데이터가 없기 때문에 대답을 못 하는 거면 "똥"이라고 대답해.
        
        여행 목적을 파악하고 필요한 정보를 질문한다.
        `,
      },
      ...history,
      { role: 'user', content: message },
    ];

    const answer = await this.callOllama(messages);
    return answer;
  }

  async callOllama(messages: { role: string; content: string }[]) {
    // ⚡ 여기가 핵심 — fetch 결과 변수명 절대 res 라고 쓰지 말 것
    const ollamaRes = await fetch(this.ollamaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
      }),
    });

    // 🔥 타입 명확히: TS 에러 완전 제거
    const data = (await ollamaRes.json()) as OllamaResponse;

    const content =
      data?.choices?.[0]?.message?.content ??
      '응답 생성 실패';

    return content;
  }
}
