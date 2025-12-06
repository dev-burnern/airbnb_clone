import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReviewsTables1733470800010 implements MigrationInterface {
    name = 'CreateReviewsTables1733470800010';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "reviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "content" text NOT NULL,
                "rating" integer NOT NULL DEFAULT 5,
                "listing_id" uuid NOT NULL,
                "author_id" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_reviews" PRIMARY KEY ("id"),
                CONSTRAINT "FK_reviews_listing_id" FOREIGN KEY ("listing_id") 
                    REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_reviews_author_id" FOREIGN KEY ("author_id") 
                    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_reviews_listing_id" ON "reviews" ("listing_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_reviews_author_id" ON "reviews" ("author_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_reviews_rating" ON "reviews" ("rating")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_reviews_rating"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_reviews_author_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_reviews_listing_id"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "reviews"`);
    }
}
