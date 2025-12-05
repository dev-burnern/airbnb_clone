#!/usr/bin/env ts-node
/**
 * 🗄️ 데이터베이스 백업/복원 스크립트
 * 
 * 사용법:
 *   npm run backup              # 백업 생성
 *   npm run backup:tables       # 특정 테이블만 백업
 *   npm run restore             # 최신 백업 복원
 *   npm run restore:file <파일> # 특정 백업 파일 복원
 */

import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 환경변수 로드
dotenv.config({ path: path.join(__dirname, '../../backend/.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5432';
const DB_USER = process.env.DB_USERNAME || 'airbnb';
const DB_PASSWORD = process.env.DB_PASSWORD || 'airbnb';
const DB_NAME = process.env.DB_DATABASE || 'airbnb';

const BACKUP_DIR = path.join(__dirname, '../backups');

// 백업 디렉토리 생성
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * 전체 데이터베이스 백업
 */
async function backup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_${timestamp}.sql`;
    const filepath = path.join(BACKUP_DIR, filename);

    console.log('📦 데이터베이스 백업 시작...');
    console.log(`📁 백업 파일: ${filepath}`);

    return new Promise((resolve, reject) => {
        const command = `docker exec airbnb_db pg_dump -U ${DB_USER} -d ${DB_NAME} -F p > "${filepath}"`;

        exec(command, { env: { ...process.env, PGPASSWORD: DB_PASSWORD } }, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ 백업 실패:', error.message);
                reject(error);
                return;
            }

            const stats = fs.statSync(filepath);
            console.log(`✅ 백업 완료! (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
            resolve(filepath);
        });
    });
}

/**
 * 특정 테이블만 백업
 */
async function backupTables(tables: string[]): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_tables_${timestamp}.sql`;
    const filepath = path.join(BACKUP_DIR, filename);

    const tableFlags = tables.map(t => `-t ${t}`).join(' ');

    console.log(`📦 테이블 백업 시작: ${tables.join(', ')}`);

    return new Promise((resolve, reject) => {
        const command = `docker exec airbnb_db pg_dump -U ${DB_USER} -d ${DB_NAME} ${tableFlags} -F p > "${filepath}"`;

        exec(command, { env: { ...process.env, PGPASSWORD: DB_PASSWORD } }, (error) => {
            if (error) {
                console.error('❌ 백업 실패:', error.message);
                reject(error);
                return;
            }
            console.log(`✅ 테이블 백업 완료: ${filepath}`);
            resolve(filepath);
        });
    });
}

/**
 * 백업 복원
 */
async function restore(filepath?: string): Promise<void> {
    // 파일이 지정되지 않으면 최신 백업 사용
    if (!filepath) {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.startsWith('backup_') && f.endsWith('.sql'))
            .sort()
            .reverse();

        if (files.length === 0) {
            console.error('❌ 백업 파일을 찾을 수 없습니다.');
            return;
        }
        filepath = path.join(BACKUP_DIR, files[0]);
    }

    if (!fs.existsSync(filepath)) {
        console.error(`❌ 파일을 찾을 수 없습니다: ${filepath}`);
        return;
    }

    console.log(`🔄 백업 복원 시작: ${filepath}`);
    console.warn('⚠️  기존 데이터가 덮어쓰기됩니다!');

    return new Promise((resolve, reject) => {
        // Docker에서 파일 복원
        const command = `docker exec -i airbnb_db psql -U ${DB_USER} -d ${DB_NAME} < "${filepath}"`;

        exec(command, { env: { ...process.env, PGPASSWORD: DB_PASSWORD } }, (error) => {
            if (error) {
                console.error('❌ 복원 실패:', error.message);
                reject(error);
                return;
            }
            console.log('✅ 백업 복원 완료!');
            resolve();
        });
    });
}

/**
 * 백업 목록 조회
 */
function listBackups(): void {
    console.log('\n📋 백업 목록:\n');

    const files = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.endsWith('.sql'))
        .sort()
        .reverse();

    if (files.length === 0) {
        console.log('  백업 파일이 없습니다.');
        return;
    }

    files.forEach((file, index) => {
        const filepath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filepath);
        const size = (stats.size / 1024 / 1024).toFixed(2);
        const date = stats.mtime.toLocaleString('ko-KR');
        console.log(`  ${index + 1}. ${file} (${size} MB) - ${date}`);
    });
}

/**
 * 오래된 백업 정리 (기본: 7일)
 */
function cleanupBackups(daysToKeep: number = 7): void {
    console.log(`🧹 ${daysToKeep}일 이상 된 백업 정리 중...`);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.sql'));
    let deleted = 0;

    files.forEach(file => {
        const filepath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filepath);

        if (stats.mtime < cutoffDate) {
            fs.unlinkSync(filepath);
            deleted++;
            console.log(`  🗑️ 삭제: ${file}`);
        }
    });

    console.log(`✅ ${deleted}개 파일 정리 완료`);
}

// CLI 실행
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'backup':
        backup();
        break;
    case 'backup:tables':
        const tables = args.slice(1);
        if (tables.length === 0) {
            console.log('사용법: npm run backup:tables users listings bookings');
        } else {
            backupTables(tables);
        }
        break;
    case 'restore':
        restore(args[1]);
        break;
    case 'list':
        listBackups();
        break;
    case 'cleanup':
        cleanupBackups(parseInt(args[1]) || 7);
        break;
    default:
        console.log(`
🗄️ 데이터베이스 백업/복원 도구

사용법:
  ts-node backup.ts backup           전체 데이터베이스 백업
  ts-node backup.ts backup:tables    특정 테이블만 백업
  ts-node backup.ts restore [파일]   백업 복원
  ts-node backup.ts list             백업 목록 조회
  ts-node backup.ts cleanup [일수]   오래된 백업 정리
        `);
}

export { backup, backupTables, restore, listBackups, cleanupBackups };
