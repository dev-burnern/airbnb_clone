import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateListingsTables1733470800005 implements MigrationInterface {
    name = 'CreateListingsTables1733470800005';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "listings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" text NOT NULL,
                "type" character varying NOT NULL,
                "address" character varying NOT NULL,
                "latitude" decimal(10,6) NOT NULL,
                "longitude" decimal(10,6) NOT NULL,
                "images" text NOT NULL,
                "amenities" json NOT NULL,
                "maxGuests" integer NOT NULL,
                "basePrice" integer NOT NULL,
                "weekendPrice" integer,
                "smartPricingEnabled" boolean NOT NULL DEFAULT false,
                "priceConfig" json,
                "hostId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_listings" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "listings" 
            ADD CONSTRAINT "FK_listings_hostId" 
            FOREIGN KEY ("hostId") REFERENCES "users"("id") 
            ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_listings_type" ON "listings" ("type")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_listings_hostId" ON "listings" ("hostId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_listings_hostId"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_listings_type"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT IF EXISTS "FK_listings_hostId"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "listings"`);
    }
}
