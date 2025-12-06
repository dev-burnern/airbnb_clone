import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWishlistTables1733470800011 implements MigrationInterface {
    name = 'CreateWishlistTables1733470800011';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // wishlists 테이블 생성
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "wishlists" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "PK_5c6c34bee7cd66529f0a4b3f6ea" PRIMARY KEY ("id")
            )
        `);

        // wishlists_listings_listing 조인 테이블 생성 (ManyToMany 관계)
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "wishlists_listings_listing" (
                "wishlistsId" uuid NOT NULL,
                "listingId" uuid NOT NULL,
                CONSTRAINT "PK_wishlist_listing" PRIMARY KEY ("wishlistsId", "listingId")
            )
        `);

        // 인덱스 생성
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_wishlists_listings_wishlistsId" 
            ON "wishlists_listings_listing" ("wishlistsId")
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_wishlists_listings_listingId" 
            ON "wishlists_listings_listing" ("listingId")
        `);

        // Foreign Key 제약조건 추가
        await queryRunner.query(`
            ALTER TABLE "wishlists" 
            ADD CONSTRAINT "FK_wishlists_userId" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "wishlists_listings_listing" 
            ADD CONSTRAINT "FK_wishlists_listings_wishlistsId" 
            FOREIGN KEY ("wishlistsId") REFERENCES "wishlists"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "wishlists_listings_listing" 
            ADD CONSTRAINT "FK_wishlists_listings_listingId" 
            FOREIGN KEY ("listingId") REFERENCES "listings"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Foreign Key 제약조건 삭제
        await queryRunner.query(`ALTER TABLE "wishlists_listings_listing" DROP CONSTRAINT IF EXISTS "FK_wishlists_listings_listingId"`);
        await queryRunner.query(`ALTER TABLE "wishlists_listings_listing" DROP CONSTRAINT IF EXISTS "FK_wishlists_listings_wishlistsId"`);
        await queryRunner.query(`ALTER TABLE "wishlists" DROP CONSTRAINT IF EXISTS "FK_wishlists_userId"`);

        // 인덱스 삭제
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_wishlists_listings_listingId"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_wishlists_listings_wishlistsId"`);

        // 테이블 삭제
        await queryRunner.query(`DROP TABLE IF EXISTS "wishlists_listings_listing"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "wishlists"`);
    }
}
