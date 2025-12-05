#!/usr/bin/env ts-node
/**
 * ✅ 데이터 무결성 검증 스크립트
 * 
 * 사용법:
 *   npm run validate              # 전체 검증
 *   npm run validate:fk           # 외래키 검증
 *   npm run validate:null         # NULL 값 검증
 *   npm run validate:duplicates   # 중복 데이터 검증
 */

import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../data-source';

interface ValidationResult {
    passed: boolean;
    table: string;
    check: string;
    message: string;
    count?: number;
}

const results: ValidationResult[] = [];

async function validateForeignKeys(dataSource: DataSource) {
    console.log('\n🔗 외래키 무결성 검증');
    console.log('='.repeat(60));

    // 외래키 관계 목록 조회
    const fkConstraints = await dataSource.query(`
        SELECT
            tc.table_name,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
    `);

    for (const fk of fkConstraints) {
        // 고아 레코드 확인 (참조하는 테이블에 없는 FK 값)
        const orphans = await dataSource.query(`
            SELECT COUNT(*) as count
            FROM "${fk.table_name}" t
            WHERE t."${fk.column_name}" IS NOT NULL
            AND NOT EXISTS (
                SELECT 1 FROM "${fk.foreign_table_name}" f
                WHERE f."${fk.foreign_column_name}" = t."${fk.column_name}"
            )
        `);

        const count = parseInt(orphans[0].count);
        const passed = count === 0;

        results.push({
            passed,
            table: fk.table_name,
            check: 'Foreign Key',
            message: passed
                ? `${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name} ✅`
                : `${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name} ❌ (${count}개 고아 레코드)`,
            count
        });

        console.log(`  ${passed ? '✅' : '❌'} ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name} ${count > 0 ? `(${count}개 오류)` : ''}`);
    }
}

async function validateRequiredFields(dataSource: DataSource) {
    console.log('\n📋 필수 필드 NULL 값 검증');
    console.log('='.repeat(60));

    // 중요한 테이블과 필수 컬럼 정의
    const requiredFields = [
        { table: 'users', columns: ['email'] },
        { table: 'listings', columns: ['title', 'description', 'type'] },
        { table: 'bookings', columns: ['"checkIn"', '"checkOut"', '"totalPrice"'] },
        { table: 'rooms', columns: ['room_name', 'room_price'] },
        { table: 'messages', columns: ['content', '"conversationId"'] },
        { table: 'reviews', columns: ['content_text', 'room_id'] },
    ];

    for (const { table, columns } of requiredFields) {
        for (const column of columns) {
            try {
                const nulls = await dataSource.query(`
                    SELECT COUNT(*) as count FROM "${table}" WHERE ${column} IS NULL
                `);

                const count = parseInt(nulls[0].count);
                const passed = count === 0;

                results.push({
                    passed,
                    table,
                    check: 'Required Field',
                    message: `${column} ${passed ? '✅' : `❌ NULL 값 ${count}개`}`,
                    count
                });

                console.log(`  ${passed ? '✅' : '❌'} ${table}.${column} ${count > 0 ? `(${count}개 NULL)` : ''}`);
            } catch (e) {
                // 테이블이나 컬럼이 없는 경우 스킵
            }
        }
    }
}

async function validateDuplicates(dataSource: DataSource) {
    console.log('\n🔄 중복 데이터 검증');
    console.log('='.repeat(60));

    // 중복 검사할 유니크 필드
    const uniqueFields = [
        { table: 'users', column: 'email' },
        { table: 'user_profile', column: 'user_id' },
    ];

    for (const { table, column } of uniqueFields) {
        try {
            const duplicates = await dataSource.query(`
                SELECT ${column}, COUNT(*) as count
                FROM "${table}"
                GROUP BY ${column}
                HAVING COUNT(*) > 1
            `);

            const passed = duplicates.length === 0;

            results.push({
                passed,
                table,
                check: 'Duplicate',
                message: `${column} 중복 ${passed ? '없음 ✅' : `${duplicates.length}건 발견 ❌`}`,
                count: duplicates.length
            });

            console.log(`  ${passed ? '✅' : '❌'} ${table}.${column} ${duplicates.length > 0 ? `(${duplicates.length}개 중복)` : ''}`);
        } catch (e) {
            // 스킵
        }
    }
}

async function validateDataRanges(dataSource: DataSource) {
    console.log('\n📏 데이터 범위 검증');
    console.log('='.repeat(60));

    // 범위 검사
    const rangeChecks = [
        {
            table: 'bookings',
            check: '"checkOut" > "checkIn"',
            message: '체크아웃이 체크인보다 이후인지'
        },
        {
            table: 'bookings',
            check: '"totalPrice" >= 0',
            message: '총 가격이 0 이상인지'
        },
        {
            table: 'rooms',
            check: 'room_price >= 0',
            message: '객실 가격이 0 이상인지'
        },
        {
            table: 'reviews',
            check: 'star_point >= 1 AND star_point <= 5',
            message: '별점이 1~5 사이인지'
        },
        {
            table: 'listings',
            check: '"maxGuests" >= 1',
            message: '최대 게스트가 1명 이상인지'
        },
    ];

    for (const { table, check, message } of rangeChecks) {
        try {
            const invalid = await dataSource.query(`
                SELECT COUNT(*) as count FROM "${table}" WHERE NOT (${check})
            `);

            const count = parseInt(invalid[0].count);
            const passed = count === 0;

            results.push({
                passed,
                table,
                check: 'Data Range',
                message: `${message} ${passed ? '✅' : `❌ ${count}개 위반`}`,
                count
            });

            console.log(`  ${passed ? '✅' : '❌'} ${table}: ${message} ${count > 0 ? `(${count}개 위반)` : ''}`);
        } catch (e) {
            // 스킵
        }
    }
}

async function validateRelationships(dataSource: DataSource) {
    console.log('\n🔗 관계 일관성 검증');
    console.log('='.repeat(60));

    // 비즈니스 로직 검증
    const checks = [
        {
            name: '예약에 게스트와 숙소가 있는지',
            query: `SELECT COUNT(*) as count FROM bookings WHERE "guestId" IS NULL OR "listingId" IS NULL`
        },
        {
            name: '대화에 참가자가 있는지',
            query: `SELECT COUNT(*) as count FROM conversations WHERE "participant1Id" IS NULL OR "participant2Id" IS NULL`
        },
        {
            name: '메시지에 발신자가 있는지',
            query: `SELECT COUNT(*) as count FROM messages WHERE "senderId" IS NULL`
        },
    ];

    for (const { name, query } of checks) {
        try {
            const result = await dataSource.query(query);
            const count = parseInt(result[0].count);
            const passed = count === 0;

            results.push({
                passed,
                table: '',
                check: 'Relationship',
                message: `${name} ${passed ? '✅' : `❌ ${count}개 문제`}`,
                count
            });

            console.log(`  ${passed ? '✅' : '❌'} ${name} ${count > 0 ? `(${count}개 문제)` : ''}`);
        } catch (e) {
            // 스킵
        }
    }
}

async function generateReport() {
    console.log('\n\n📊 검증 결과 요약');
    console.log('='.repeat(60));

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;

    console.log(`  ✅ 통과: ${passed}개`);
    console.log(`  ❌ 실패: ${failed}개`);
    console.log(`  📋 총계: ${results.length}개`);

    if (failed > 0) {
        console.log('\n❌ 실패한 검증:');
        results.filter(r => !r.passed).forEach(r => {
            console.log(`  - [${r.table}] ${r.check}: ${r.message}`);
        });
    }

    console.log('\n' + (failed === 0 ? '🎉 모든 검증 통과!' : '⚠️ 일부 검증 실패 - 데이터 확인 필요'));

    return { passed, failed, total: results.length };
}

// 메인 실행
async function main() {
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    console.log('\n✅ 데이터 무결성 검증 시작\n');

    try {
        const command = process.argv[2] || 'all';

        switch (command) {
            case 'fk':
                await validateForeignKeys(dataSource);
                break;
            case 'null':
                await validateRequiredFields(dataSource);
                break;
            case 'duplicates':
                await validateDuplicates(dataSource);
                break;
            case 'ranges':
                await validateDataRanges(dataSource);
                break;
            case 'all':
            default:
                await validateForeignKeys(dataSource);
                await validateRequiredFields(dataSource);
                await validateDuplicates(dataSource);
                await validateDataRanges(dataSource);
                await validateRelationships(dataSource);
        }

        await generateReport();

    } finally {
        await dataSource.destroy();
    }
}

main().catch(console.error);

export {
    validateForeignKeys,
    validateRequiredFields,
    validateDuplicates,
    validateDataRanges,
    validateRelationships
};
