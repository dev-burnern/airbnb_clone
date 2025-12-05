import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 환경변수 로드
dotenv.config({ path: path.join(__dirname, '../backend/.env') });
dotenv.config({ path: path.join(__dirname, '../backend/.env.development') });

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'airbnb',
    password: process.env.DB_PASSWORD || 'airbnb',
    database: process.env.DB_DATABASE || 'airbnb',
    entities: [path.join(__dirname, '../backend/dist/**/*.entity.js')],
    migrations: [path.join(__dirname, './migrations/*.ts')],
    synchronize: false, // 마이그레이션 사용 시 false로 설정
    logging: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

