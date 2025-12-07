import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle('Airbnb Clone API')
        .setDescription('에어비앤비 클론 프로젝트 RESTful API 문서')
        .setVersion('1.0.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'access-token',
        )
        .addTag('Auth', '인증 및 권한')
        .addTag('Users', '사용자 관리')
        .addTag('Listings', '숙소 리스팅')
        .addTag('Bookings', '예약 관리')
        .addTag('Reviews', '리뷰 관리')
        .addTag('Wishlists', '위시리스트')
        .addTag('Chat', '실시간 채팅')
        .addTag('Chatbot', 'AI 챗봇')
        .addTag('Payments', '결제 관리')

        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    });
}
