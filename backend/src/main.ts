import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // ConfigService
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3001);
    const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');

    // Global Prefix
    app.setGlobalPrefix(apiPrefix);

    // CORS
    app.enableCors({
        origin: configService.get<string>('FRONTEND_URL', 'http://localhost:3000'),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Airbnb Clone API')
    .setDescription('에어비앤비 클론 프로젝트 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(3001);
  console.log('🚀 Application is running on: http://localhost:3001/api/v1');
  console.log('📚 Swagger documentation: http://localhost:3001/api/v1/docs');
}
bootstrap();