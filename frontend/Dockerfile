# 1️⃣ 빌드 단계
FROM node:20 AS build

# 컨테이너 안의 작업 디렉토리
WORKDIR /frontend

# package.json과 lock 파일만 먼저 복사 → 캐시 활용
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 전체 복사
COPY . .

# Next.js 빌드
RUN npm run build

# 2️⃣ 실행 단계
FROM node:20-alpine AS runner

WORKDIR /frontend

# 빌드 결과물과 실행에 필요한 파일 복사
COPY --from=build /frontend/.next ./.next
COPY --from=build /frontend/public ./public
COPY --from=build /frontend/package*.json ./
COPY --from=build /frontend/node_modules ./node_modules

EXPOSE 3000

# Next.js 프로덕션 서버 실행
CMD ["npm", "start"]
