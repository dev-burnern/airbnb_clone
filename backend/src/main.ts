import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config/swagger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
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

    // Global Pipes
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Global Filters
    app.useGlobalFilters(new HttpExceptionFilter());

    // Global Interceptors
    app.useGlobalInterceptors(new TransformInterceptor());

    // Swagger Setup
    setupSwagger(app);

    await app.listen(port);
    logger.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
    logger.log(`📚 Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();
// Restart trigger 6
