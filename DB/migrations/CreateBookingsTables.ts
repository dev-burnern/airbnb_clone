import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookingsTables implements MigrationInterface {
    name = 'CreateBookingsTables';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // BookingStatus ENUM 생성
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "booking_status_enum" AS ENUM ('PENDING', 'PAID', 'CONFIRMED', 'REJECTED', 'CANCELLED');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // bookings 테이블 생성
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "bookings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "checkIn" date NOT NULL,
                "checkOut" date NOT NULL,
                "guestCount" integer NOT NULL,
                "totalPrice" integer NOT NULL,
                "status" "booking_status_enum" NOT NULL DEFAULT 'PENDING',
                "guestId" uuid,
                "listingId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_bookings" PRIMARY KEY ("id")
            )
        `);

        // Foreign Keys
        await queryRunner.query(`
            ALTER TABLE "bookings" 
            ADD CONSTRAINT "FK_bookings_guestId" 
            FOREIGN KEY ("guestId") REFERENCES "users"("id") 
            ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "bookings" 
            ADD CONSTRAINT "FK_bookings_listingId" 
            FOREIGN KEY ("listingId") REFERENCES "listings"("id") 
            ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        // 인덱스
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_bookings_guestId" ON "bookings" ("guestId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_bookings_listingId" ON "bookings" ("listingId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_bookings_status" ON "bookings" ("status")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bookings_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bookings_listingId"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bookings_guestId"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "FK_bookings_listingId"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "FK_bookings_guestId"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "bookings"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "booking_status_enum"`);
    }
}
