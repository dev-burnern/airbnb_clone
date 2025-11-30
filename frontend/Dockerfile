# 1단계: 빌드 단계
FROM node:20 AS builder
WORKDIR /app

# 먼저 의존성 설치
COPY package*.json ./
RUN npm ci

# 소스 복사 후 빌드
COPY . .
RUN npm run build

# 2단계: 런타임 단계
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 실행에 필요한 의존성만 설치
COPY package*.json ./
RUN npm ci --omit=dev

# 빌드 결과 및 정적 파일 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000
CMD ["npm", "run", "start"]
