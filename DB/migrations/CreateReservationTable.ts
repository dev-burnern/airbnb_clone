import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReservationTable implements MigrationInterface {
    name = 'CreateReservationTable';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "reservation" (
                "reservation_id" SERIAL NOT NULL,
                "check_in_date" TIMESTAMP NOT NULL,
                "check_out_date" TIMESTAMP NOT NULL,
                "adults" integer,
                "childeren" integer,
                "infants" integer,
                "pets" integer,
                "status" text,
                "room_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_reservation" PRIMARY KEY ("reservation_id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "reservation" 
            ADD CONSTRAINT "FK_reservation_room_id" 
            FOREIGN KEY ("room_id") REFERENCES "rooms"("room_id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_reservation_room_id" ON "reservation" ("room_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_reservation_check_in_date" ON "reservation" ("check_in_date")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_reservation_check_in_date"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_reservation_room_id"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT IF EXISTS "FK_reservation_room_id"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "reservation"`);
    }
}
