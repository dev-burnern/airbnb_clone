import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReviewsTables1733470800010 implements MigrationInterface {
    name = 'CreateReviewsTables1733470800010';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "reviews" (
                "review_id" SERIAL NOT NULL,
                "content_text" text NOT NULL,
                "status" text,
                "star_point" integer,
                "room_id" integer NOT NULL,
                "user_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_reviews" PRIMARY KEY ("review_id"),
                CONSTRAINT "FK_reviews_user_id" FOREIGN KEY ("user_id") 
                    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
            )
        `);

        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_reviews_room_id" ON "reviews" ("room_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_reviews_user_id" ON "reviews" ("user_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_reviews_star_point" ON "reviews" ("star_point")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_reviews_star_point"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_reviews_user_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_reviews_room_id"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "reviews"`);
    }
}
