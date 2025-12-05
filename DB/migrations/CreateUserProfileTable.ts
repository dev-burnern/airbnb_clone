import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserProfileTable implements MigrationInterface {
    name = 'CreateUserProfileTable';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user_profile" (
                "profile_id" SERIAL NOT NULL,
                "user_id" integer NOT NULL UNIQUE,
                "image_name" character varying(50) NOT NULL,
                "path" text NOT NULL,
                "introduction_text" text,
                "location" text NOT NULL,
                "language" character varying(100) NOT NULL,
                "job" text,
                "status" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_user_profile" PRIMARY KEY ("profile_id")
            )
        `);

        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_user_profile_user_id" ON "user_profile" ("user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_profile_user_id"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user_profile"`);
    }
}
