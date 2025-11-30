# 1단계: 빌드 이미지
FROM node:20 AS builder
WORKDIR /app

# 의존성 먼저 설치 (캐시 극대화)
COPY package*.json ./
RUN npm ci

# 소스 복사 후 빌드
COPY . .
RUN npm run build

# 2단계: 런타임 이미지 (슬림)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm ci --omit=dev

# 빌드 결과물만 복사
COPY --from=builder /app/dist ./dist

# Nest 메인 포트 (예: 3001)
EXPOSE 3001

CMD ["node", "dist/main.js"]
