import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserProfileTable1733470800002 implements MigrationInterface {
    name = 'CreateUserProfileTable1733470800002';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user_profile" (
                "profile_id" SERIAL NOT NULL,
                "user_id" uuid NOT NULL UNIQUE,
                "image_name" character varying(50) NOT NULL,
                "path" text NOT NULL,
                "introduction_text" text,
                "location" text NOT NULL,
                "language" character varying(100) NOT NULL,
                "job" text,
                "status" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_user_profile" PRIMARY KEY ("profile_id"),
                CONSTRAINT "FK_user_profile_user_id" FOREIGN KEY ("user_id") 
                    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
            )
        `);

        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_user_profile_user_id" ON "user_profile" ("user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_profile_user_id"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user_profile"`);
    }
}
