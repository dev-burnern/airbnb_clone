# 🗃️ Airbnb Clone Database Tools

데이터베이스 마이그레이션, 시드 데이터, 백업/복원, 분석 도구 모음입니다.

## 📁 구조

```
DB/
├── migrations/             # 마이그레이션 파일들 (타임스탬프 순서)
│   ├── 1733470800001-CreateUsersTables.ts
│   ├── 1733470800002-CreateUserProfileTable.ts
│   ├── 1733470800003-CreateHostPropertyTables.ts
│   ├── 1733470800004-CreateRoomsTables.ts
│   ├── 1733470800005-CreateListingsTables.ts
│   ├── 1733470800006-CreateBookingsTables.ts
│   ├── 1733470800007-CreateReservationTable.ts
│   ├── 1733470800008-CreateChatTables.ts
│   ├── 1733470800009-CreateChatbotTables.ts
│   ├── 1733470800010-CreateReviewsTables.ts
│   └── 1733470800011-CreateWishlistTables.ts
├── seeds/                  # 시드 데이터
│   └── seed.ts             # 전체 시드 스크립트
├── scripts/                # 유틸리티 스크립트
│   ├── backup.ts           # 백업/복원
│   ├── analyze.ts          # 인덱스 분석
│   └── validate.ts         # 데이터 검증
├── data-source.ts          # TypeORM 데이터소스
├── SCHEMA.md               # ERD 스키마 문서
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 시작하기

```bash
cd DB
npm install
```

> **Note**: 백엔드의 `.env` 파일에서 DB 연결 정보를 읽어옵니다.

## 📜 전체 명령어

### 마이그레이션
| 명령어 | 설명 |
|--------|------|
| `npm run migration:run` | 마이그레이션 실행 |
| `npm run migration:revert` | 마지막 마이그레이션 롤백 |
| `npm run migration:show` | 상태 확인 |
| `npm run migration:generate -- ./migrations/이름` | 자동 생성 |
| `npm run migration:create -- ./migrations/이름` | 빈 파일 생성 |
| `npm run schema:drop` | 전체 스키마 삭제 ⚠️ |

### 시드 데이터
| 명령어 | 설명 |
|--------|------|
| `npm run seed` | 시드 데이터 생성 (1,500+ 레코드) |
| `npm run seed:fresh` | DB 초기화 후 전체 재생성 |

### 백업/복원
| 명령어 | 설명 |
|--------|------|
| `npm run backup` | 전체 데이터베이스 백업 |
| `npm run backup:tables users listings` | 특정 테이블만 백업 |
| `npm run backup:list` | 백업 목록 조회 |
| `npm run backup:cleanup` | 7일 이상 된 백업 삭제 |
| `npm run restore` | 최신 백업 복원 |

### 분석/최적화
| 명령어 | 설명 |
|--------|------|
| `npm run analyze` | 전체 분석 실행 |
| `npm run analyze:indexes` | 인덱스 분석 |
| `npm run analyze:stats` | 테이블 통계 |
| `npm run analyze:slow` | 느린 쿼리 분석 |

### 데이터 검증
| 명령어 | 설명 |
|--------|------|
| `npm run validate` | 전체 검증 실행 |
| `npm run validate:fk` | 외래키 무결성 검증 |
| `npm run validate:null` | NULL 값 검증 |
| `npm run validate:duplicates` | 중복 데이터 검증 |

## 📊 생성되는 시드 데이터

| 카테고리 | 데이터 수 |
|----------|----------|
| 사용자/프로필 | 80개 |
| 숙소/객실/이미지 | 600+개 |
| 예약 | 250개 |
| 채팅/메시지 | 350+개 |
| 챗봇 | 370+개 |
| 리뷰 | 200개 |
| 위시리스트 | 240+개 |
| **총합** | **1,500+ 레코드** |

## 🔧 스키마 특징

### UUID 사용
- `users.id` - UUID 기본 키
- `user_profile.user_id` - UUID + FK
- `chatbot_session.user_id` - UUID + FK
- `reviews.user_id` - UUID + FK

### 마이그레이션 순서
마이그레이션 파일명에 13자리 타임스탬프가 포함되어 **FK 의존성 순서**로 실행됩니다:
1. `users` → 2. `user_profile` (FK) → ... → 11. `wishlists` (FK)

## ⚠️ 주의사항

1. **프로덕션 환경**: 반드시 `synchronize: false` 사용
2. **백업**: 중요 작업 전 백업 필수
3. **마이그레이션 순서**: 타임스탬프에 따라 자동 정렬됨

## 🔗 관련 문서

- [SCHEMA.md](./SCHEMA.md) - ERD 및 테이블 관계도
- [TypeORM Migrations](https://typeorm.io/migrations)
