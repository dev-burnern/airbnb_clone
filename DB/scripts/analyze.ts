#!/usr/bin/env ts-node
/**
 * 🔍 인덱스 최적화 분석 스크립트
 * 
 * 사용법:
 *   npm run analyze:indexes        # 인덱스 분석
 *   npm run analyze:slow-queries   # 느린 쿼리 분석
 *   npm run analyze:table-stats    # 테이블 통계
 */

import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../data-source';

async function analyzeIndexes() {
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    console.log('\n🔍 인덱스 분석 시작...\n');

    try {
        // 1. 현재 인덱스 목록
        console.log('📊 현재 인덱스 목록');
        console.log('='.repeat(80));

        const indexes = await dataSource.query(`
            SELECT 
                schemaname,
                tablename,
                indexname,
                indexdef
            FROM pg_indexes
            WHERE schemaname = 'public'
            ORDER BY tablename, indexname
        `);

        let currentTable = '';
        indexes.forEach((idx: any) => {
            if (idx.tablename !== currentTable) {
                currentTable = idx.tablename;
                console.log(`\n📁 ${currentTable}`);
            }
            console.log(`   └─ ${idx.indexname}`);
        });

        // 2. 사용되지 않는 인덱스
        console.log('\n\n⚠️ 사용되지 않는 인덱스 (삭제 권장)');
        console.log('='.repeat(80));

        const unusedIndexes = await dataSource.query(`
            SELECT 
                schemaname || '.' || relname AS table,
                indexrelname AS index,
                pg_size_pretty(pg_relation_size(i.indexrelid)) AS index_size,
                idx_scan as scans
            FROM pg_stat_user_indexes ui
            JOIN pg_index i ON ui.indexrelid = i.indexrelid
            WHERE NOT indisunique 
            AND idx_scan < 50
            AND pg_relation_size(relid) > 5 * 8192
            ORDER BY pg_relation_size(i.indexrelid) / nullif(idx_scan, 0) DESC NULLS FIRST
            LIMIT 10
        `);

        if (unusedIndexes.length === 0) {
            console.log('  ✅ 사용되지 않는 인덱스가 없습니다.');
        } else {
            unusedIndexes.forEach((idx: any) => {
                console.log(`  ⚠️ ${idx.table}.${idx.index} (크기: ${idx.index_size}, 스캔: ${idx.scans}회)`);
            });
        }

        // 3. 누락된 인덱스 추천
        console.log('\n\n💡 인덱스 추가 권장 (자주 검색되는 컬럼)');
        console.log('='.repeat(80));

        const missingIndexes = await dataSource.query(`
            SELECT 
                schemaname || '.' || relname AS table,
                seq_scan,
                seq_tup_read,
                idx_scan,
                n_live_tup AS row_count
            FROM pg_stat_user_tables
            WHERE seq_scan > 0
            AND n_live_tup > 100
            AND (idx_scan IS NULL OR idx_scan = 0)
            ORDER BY seq_tup_read DESC
            LIMIT 10
        `);

        if (missingIndexes.length === 0) {
            console.log('  ✅ 모든 테이블에 적절한 인덱스가 있습니다.');
        } else {
            missingIndexes.forEach((tbl: any) => {
                console.log(`  💡 ${tbl.table} (행: ${tbl.row_count}, 순차스캔: ${tbl.seq_scan}회)`);
            });
        }

        // 4. 인덱스 크기
        console.log('\n\n📏 인덱스 크기 (상위 10개)');
        console.log('='.repeat(80));

        const indexSizes = await dataSource.query(`
            SELECT 
                indexrelname AS index_name,
                relname AS table_name,
                pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
            FROM pg_stat_user_indexes
            ORDER BY pg_relation_size(indexrelid) DESC
            LIMIT 10
        `);

        indexSizes.forEach((idx: any) => {
            console.log(`  ${idx.table_name}.${idx.index_name}: ${idx.index_size}`);
        });

    } finally {
        await dataSource.destroy();
    }
}

async function analyzeSlowQueries() {
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    console.log('\n🐢 느린 쿼리 분석\n');
    console.log('='.repeat(80));

    try {
        // pg_stat_statements 확장이 필요함
        const hasExtension = await dataSource.query(`
            SELECT EXISTS (
                SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
            ) as has_extension
        `);

        if (!hasExtension[0]?.has_extension) {
            console.log('⚠️ pg_stat_statements 확장이 설치되어 있지 않습니다.');
            console.log('   설치: CREATE EXTENSION pg_stat_statements;');
            return;
        }

        const slowQueries = await dataSource.query(`
            SELECT 
                substring(query, 1, 100) as query_preview,
                calls,
                round(total_exec_time::numeric, 2) as total_time_ms,
                round(mean_exec_time::numeric, 2) as avg_time_ms,
                rows
            FROM pg_stat_statements
            ORDER BY mean_exec_time DESC
            LIMIT 10
        `);

        slowQueries.forEach((q: any, i: number) => {
            console.log(`\n${i + 1}. 평균 ${q.avg_time_ms}ms (총 ${q.calls}회 호출)`);
            console.log(`   ${q.query_preview}...`);
        });

    } catch (error: any) {
        console.log('⚠️ 느린 쿼리 분석 실패:', error.message);
    } finally {
        await dataSource.destroy();
    }
}

async function analyzeTableStats() {
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    console.log('\n📊 테이블 통계\n');
    console.log('='.repeat(80));

    try {
        const stats = await dataSource.query(`
            SELECT 
                relname AS table_name,
                n_live_tup AS row_count,
                n_dead_tup AS dead_rows,
                pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
                pg_size_pretty(pg_relation_size(relid)) AS table_size,
                pg_size_pretty(pg_indexes_size(relid)) AS index_size,
                last_vacuum,
                last_analyze
            FROM pg_stat_user_tables
            ORDER BY pg_total_relation_size(relid) DESC
        `);

        console.log('테이블명'.padEnd(30) + '행 수'.padStart(10) + '총 크기'.padStart(12) + '인덱스'.padStart(12));
        console.log('-'.repeat(64));

        stats.forEach((tbl: any) => {
            console.log(
                tbl.table_name.padEnd(30) +
                String(tbl.row_count || 0).padStart(10) +
                (tbl.total_size || '0 bytes').padStart(12) +
                (tbl.index_size || '0 bytes').padStart(12)
            );
        });

        // 총계
        const totalSize = await dataSource.query(`
            SELECT pg_size_pretty(pg_database_size(current_database())) as db_size
        `);
        console.log('\n📦 전체 데이터베이스 크기: ' + totalSize[0].db_size);

    } finally {
        await dataSource.destroy();
    }
}

// VACUUM 및 ANALYZE 권장사항
async function recommendMaintenance() {
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    console.log('\n🔧 유지보수 권장사항\n');
    console.log('='.repeat(80));

    try {
        const tables = await dataSource.query(`
            SELECT 
                relname AS table_name,
                n_dead_tup AS dead_rows,
                n_live_tup AS live_rows,
                round(100.0 * n_dead_tup / nullif(n_live_tup + n_dead_tup, 0), 2) AS dead_ratio,
                last_vacuum,
                last_analyze
            FROM pg_stat_user_tables
            WHERE n_dead_tup > 100
            OR last_vacuum IS NULL
            OR last_analyze IS NULL
            ORDER BY n_dead_tup DESC
        `);

        if (tables.length === 0) {
            console.log('✅ 모든 테이블이 최적화되어 있습니다.');
        } else {
            tables.forEach((tbl: any) => {
                const reasons = [];
                if (tbl.dead_rows > 100) reasons.push(`죽은 행: ${tbl.dead_rows}`);
                if (!tbl.last_vacuum) reasons.push('VACUUM 필요');
                if (!tbl.last_analyze) reasons.push('ANALYZE 필요');

                console.log(`  ⚠️ ${tbl.table_name}: ${reasons.join(', ')}`);
            });

            console.log('\n권장 명령어:');
            console.log('  VACUUM ANALYZE;  -- 전체 정리');
        }

    } finally {
        await dataSource.destroy();
    }
}

// CLI
const args = process.argv.slice(2);
const command = args[0] || 'all';

async function main() {
    switch (command) {
        case 'indexes':
            await analyzeIndexes();
            break;
        case 'slow':
            await analyzeSlowQueries();
            break;
        case 'stats':
            await analyzeTableStats();
            break;
        case 'maintenance':
            await recommendMaintenance();
            break;
        case 'all':
        default:
            await analyzeIndexes();
            await analyzeTableStats();
            await recommendMaintenance();
    }
}

main().catch(console.error);

export { analyzeIndexes, analyzeSlowQueries, analyzeTableStats, recommendMaintenance };
