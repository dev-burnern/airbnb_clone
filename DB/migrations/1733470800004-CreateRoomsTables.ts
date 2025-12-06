import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoomsTables1733470800004 implements MigrationInterface {
    name = 'CreateRoomsTables1733470800004';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // locations 테이블
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "locations" (
                "location_id" SERIAL NOT NULL,
                "location_name" character varying(100) NOT NULL,
                "description_location" text NOT NULL,
                "description_traffic" text NOT NULL,
                "lat" double precision,
                "lng" double precision,
                "neighbourhood" character varying(100),
                "neighbourhood_group" character varying(100),
                CONSTRAINT "PK_locations" PRIMARY KEY ("location_id")
            )
        `);

        // room_types 테이블
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "room_types" (
                "room_types_id" SERIAL NOT NULL,
                "types_name" character varying(50) NOT NULL,
                "status" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_room_types" PRIMARY KEY ("room_types_id")
            )
        `);

        // room_options 테이블
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "room_options" (
                "room_option_id" SERIAL NOT NULL,
                "item1" integer NOT NULL,
                "item2" integer NOT NULL,
                "item3" integer NOT NULL,
                "status" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_room_options" PRIMARY KEY ("room_option_id")
            )
        `);

        // categories 테이블
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "categories" (
                "category_id" SERIAL NOT NULL,
                "category_name" character varying(50) NOT NULL,
                "status" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_categories" PRIMARY KEY ("category_id")
            )
        `);

        // rooms 테이블
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "rooms" (
                "room_id" SERIAL NOT NULL,
                "room_name" character varying(50) NOT NULL,
                "room_address" character varying(100) NOT NULL,
                "room_price" integer NOT NULL,
                "room_wishes" integer NOT NULL DEFAULT 0,
                "room_description" text,
                "check_in_time" time NOT NULL,
                "check_out_time" time NOT NULL,
                "status" text,
                "location_id" integer NOT NULL,
                "room_types_id" integer NOT NULL,
                "room_option_id" integer NOT NULL,
                "category_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_rooms" PRIMARY KEY ("room_id")
            )
        `);

        // room_images 테이블
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "room_images" (
                "image_id" SERIAL NOT NULL,
                "room_id" integer NOT NULL,
                "image_name" character varying(200) NOT NULL,
                "path" text NOT NULL,
                "status" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_room_images" PRIMARY KEY ("image_id")
            )
        `);

        // Foreign Keys
        await queryRunner.query(`
            ALTER TABLE "rooms" 
            ADD CONSTRAINT "FK_rooms_location_id" 
            FOREIGN KEY ("location_id") REFERENCES "locations"("location_id") 
            ON DELETE RESTRICT ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "rooms" 
            ADD CONSTRAINT "FK_rooms_room_types_id" 
            FOREIGN KEY ("room_types_id") REFERENCES "room_types"("room_types_id") 
            ON DELETE RESTRICT ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "rooms" 
            ADD CONSTRAINT "FK_rooms_room_option_id" 
            FOREIGN KEY ("room_option_id") REFERENCES "room_options"("room_option_id") 
            ON DELETE RESTRICT ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "rooms" 
            ADD CONSTRAINT "FK_rooms_category_id" 
            FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") 
            ON DELETE RESTRICT ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "room_images" 
            ADD CONSTRAINT "FK_room_images_room_id" 
            FOREIGN KEY ("room_id") REFERENCES "rooms"("room_id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        // 인덱스
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_rooms_location_id" ON "rooms" ("location_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_rooms_category_id" ON "rooms" ("category_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_room_images_room_id" ON "room_images" ("room_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_room_images_room_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_rooms_category_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_rooms_location_id"`);
        await queryRunner.query(`ALTER TABLE "room_images" DROP CONSTRAINT IF EXISTS "FK_room_images_room_id"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT IF EXISTS "FK_rooms_category_id"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT IF EXISTS "FK_rooms_room_option_id"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT IF EXISTS "FK_rooms_room_types_id"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT IF EXISTS "FK_rooms_location_id"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "room_images"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "rooms"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "categories"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "room_options"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "room_types"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "locations"`);
    }
}
