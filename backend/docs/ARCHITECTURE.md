# Backend Architecture - Airbnb Clone

## Overview
본 문서는 에어비앤비 클론 프로젝트의 백엔드 아키텍처를 설명합니다. NestJS 프레임워크와 PostgreSQL 데이터베이스를 기반으로 구축되었습니다.

## Technology Stack
- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16
- **ORM**: TypeORM 0.3.x
- **Authentication**: JWT, Passport.js
- **API Documentation**: Swagger/OpenAPI
- **Real-time Communication**: Socket.IO

## Project Structure

```
backend/
├── src/
│   ├── main.ts                 # 애플리케이션 진입점
│   ├── app.module.ts           # 루트 모듈
│   │
│   ├── config/                 # 설정 파일
│   │   ├── typeorm.config.ts
│   │   └── swagger.config.ts
│   │
│   ├── common/                 # 공통 모듈
│   │   ├── filters/            # HTTP 예외 필터
│   │   ├── interceptors/       # 응답 변환 인터셉터
│   │   ├── guards/             # 인증/권한 가드
│   │   └── pipes/              # 유효성 검사 파이프
│   │
│   ├── auth/                   # 인증 모듈
│   ├── users/                  # 사용자 모듈
│   ├── listings/               # 숙소 리스팅 모듈
│   ├── bookings/               # 예약 모듈
│   ├── reviews/                # 리뷰 모듈
│   ├── wishlists/              # 위시리스트 모듈
│   ├── chat/                   # 실시간 채팅 모듈
│   ├── chatbot/                # AI 챗봇 모듈
│   ├── payments/               # 결제 모듈
│   └── support/                # 고객 지원 모듈
│
├── .env.example
├── docker-compose.yml
└── package.json
```

## Module Architecture

### 1. Auth Module (인증)
- **Purpose**: JWT 기반 인증, 소셜 로그인 (GitHub, Google, Naver)
- **Strategies**: Local, JWT, GitHub OAuth
- **Guards**: JWT Guard, Roles Guard

### 2. Users Module (사용자)
- **Entities**: `User`, `UserProfile`
- **Features**: 사용자 CRUD, 프로필 관리, 역할 기반 접근 제어

### 3. Listings Module (숙소)
- **Entities**: `Room`, `Location`, `Category`, `RoomType`, `RoomOption`, `RoomImage`, `Property`, `Host`
- **Features**: 숙소 등록/조회/수정/삭제, 검색 필터링, 지도 기반 검색

### 4. Bookings Module (예약)
- **Entities**: `Reservation`
- **Features**: 예약 생성, 예약 조회, 예약 취소, 날짜 충돌 검증

### 5. Reviews Module (리뷰)
- **Entities**: `Review`
- **Features**: 리뷰 작성, 평점 계산, 호스트 답변

### 6. Wishlists Module (위시리스트)
- **Entities**: `Wishlist`
- **Features**: 위시리스트 생성, 숙소 추가/제거

### 7. Chat Module (실시간 채팅)
- **Gateway**: WebSocket 기반 실시간 통신
- **Features**: 호스트-게스트 1:1 채팅, 메시지 기록

### 8. Chatbot Module (AI 챗봇)
- **Entities**: `Chatbot`, `ChatbotSession`, `ChatbotLog`, `ChatMessage`
- **Features**: Ollama 기반 AI 대화, 티켓 생성, 의도 분류

### 9. Payments Module (결제)
- **Features**: 결제 처리, 웹훅 처리, 환불

### 10. Support Module (고객 지원)
- **Features**: 티켓 생성, 티켓 관리, 에이전트 할당

## Database Schema

### Core Entities

#### Users
- 사용자 기본 정보 (이메일, 비밀번호, OAuth 정보)
- 역할 기반 권한 (게스트, 호스트, 관리자)

#### Listings (Rooms)
- 숙소 상세 정보 (제목, 설명, 가격, 위치)
- 숙소 옵션, 타입, 카테고리
- 숙소 이미지

#### Bookings (Reservations)
- 예약 정보 (체크인/아웃 날짜, 인원)
- 예약 상태 관리

#### Reviews
- 리뷰 내용, 평점
- 호스트 답변

#### Chatbot
- AI 챗봇 대화 기록
- 세션 관리, 로그 추적

## API Structure

### Base URL
```
http://localhost:3001/api/v1
```

### Endpoints
```
/auth          - 인증 관련 (로그인, 회원가입, OAuth)
/users         - 사용자 관리
/listings      - 숙소 관리
/bookings      - 예약 관리
/reviews       - 리뷰 관리
/wishlists     - 위시리스트 관리
/chat          - 실시간 채팅 (WebSocket)
/chatbot       - AI 챗봇
/payments      - 결제 관리
/support       - 고객 지원
```

### Swagger Documentation
```
http://localhost:3001/api/v1/docs
```

## Environment Variables

```env
# Application
NODE_ENV=development
PORT=3001
API_PREFIX=api/v1

# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=airbnb

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Development Workflow

### 1. 로컬 개발
```bash
npm run start:dev
```

### 2. Docker Compose
```bash
docker-compose up --build
```

### 3. Database Migration
TypeORM의 `synchronize: true` 옵션으로 자동으로 스키마 동기화됩니다.
프로덕션 환경에서는 반드시 `synchronize: false`로 설정하고 마이그레이션을 사용하세요.

## Global Configuration

### Validation Pipe
- DTO 자동 유효성 검사
- 화이트리스트 적용 (알 수 없는 속성 제거)

### Exception Filter
- 전역 예외 처리
- 구조화된 오류 응답

### Transform Interceptor
- 모든 응답을 일관된 형식으로 변환
```json
{
  "success": true,
  "data": {...},
  "timestamp": "2025-12-01T13:36:45.000Z"
}
```

## Security

### Authentication
- JWT 기반 인증
- Refresh Token 지원
- OAuth 2.0 (GitHub, Google, Naver)

### Authorization
- Role-based Access Control (RBAC)
- Guard를 통한 엔드포인트 보호

### CORS
- Frontend URL만 허용
- Credentials 지원

## Best Practices

1. **Modular Architecture**: 도메인별로 모듈을 분리하여 유지보수성 향상
2. **DTO Pattern**: 데이터 전송 객체로 유효성 검사 및 타입 안정성 확보
3. **Repository Pattern**: 데이터 접근 로직 분리 (필요시 Custom Repository 사용)
4. **Error Handling**: 전역 예외 필터로 일관된 오류 응답
5. **API Documentation**: Swagger로 자동 문서화
6. **Environment Configuration**: ConfigModule로 환경별 설정 관리

## Deployment

### Production Checklist
- [ ] `DB_SYNCHRONIZE=false` 설정
- [ ] JWT Secret 변경
- [ ] CORS 허용 도메인 설정
- [ ] 환경 변수 보안 관리
- [ ] SSL/TLS 인증서 설정
- [ ] 로그 레벨 조정
- [ ] Rate Limiting 적용

## References
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
