import { Injectable } from '@nestjs/common';
import { ChatRequestDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  private readonly OLLAMA_URL = 'http://localhost:11434/api/chat';

  async sendToOllama(body: ChatRequestDto) {
    const res = await fetch(this.OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral', 
        messages: body.messages,
        stream: false
      })
    });

    const data = await res.json();
    return data; // { message: {role, content} ... }
  }
}


