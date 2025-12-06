import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHostPropertyTables1733470800003 implements MigrationInterface {
    name = 'CreateHostPropertyTables1733470800003';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // hosts 테이블
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "hosts" (
                "host_id" SERIAL NOT NULL,
                "host_name" character varying(100),
                "identity_verified" character varying(20),
                "listing_count" integer,
                CONSTRAINT "PK_hosts" PRIMARY KEY ("host_id")
            )
        `);

        // property 테이블
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "property" (
                "property_id" SERIAL NOT NULL,
                "property_name" character varying(50) NOT NULL,
                "status" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_property" PRIMARY KEY ("property_id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "property"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "hosts"`);
    }
}
