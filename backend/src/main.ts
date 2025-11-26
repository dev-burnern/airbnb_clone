import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat/chat.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);

  // CORS 설정
  app.enableCors({
    origin: 'http://localhost:3000', // React
    methods: 'GET,POST',
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
