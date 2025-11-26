FROM node:20-alpine

# 작업 디렉토리
WORKDIR /app

# package.json만 먼저 복사해서 의존성 설치
COPY package*.json ./
RUN npm install

# 나머지 소스 복사
COPY . .

# Nest 빌드
RUN npm run build

# 컨테이너에서 열어줄 포트 (Nest를 8080으로 띄운다는 가정)
EXPOSE 8080

# 프로덕션 모드 실행
CMD ["npm", "run", "start:prod"]
