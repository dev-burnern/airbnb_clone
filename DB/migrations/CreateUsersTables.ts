import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTables implements MigrationInterface {
    name = 'CreateUsersTables';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // UUID 확장 활성화
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // users 테이블 생성
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying,
                "githubId" character varying,
                "name" character varying,
                "avatarUrl" character varying,
                "roles" text NOT NULL DEFAULT 'guest',
                "provider" character varying(50) NOT NULL DEFAULT 'local',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

        // 인덱스 생성
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_users_email" ON "users" ("email")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_users_githubId" ON "users" ("githubId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_githubId"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    }
}
