import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChatTables implements MigrationInterface {
    name = 'CreateChatTables';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // conversations 테이블 생성
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "conversations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying,
                "participant1Id" uuid,
                "participant2Id" uuid,
                "lastMessageAt" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_conversations" PRIMARY KEY ("id")
            )
        `);

        // messages 테이블 생성
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "messages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "conversationId" uuid NOT NULL,
                "senderId" uuid,
                "content" text NOT NULL,
                "isRead" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_messages" PRIMARY KEY ("id")
            )
        `);

        // Foreign Keys
        await queryRunner.query(`
            ALTER TABLE "conversations" 
            ADD CONSTRAINT "FK_conversations_participant1Id" 
            FOREIGN KEY ("participant1Id") REFERENCES "users"("id") 
            ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "conversations" 
            ADD CONSTRAINT "FK_conversations_participant2Id" 
            FOREIGN KEY ("participant2Id") REFERENCES "users"("id") 
            ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "messages" 
            ADD CONSTRAINT "FK_messages_conversationId" 
            FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "messages" 
            ADD CONSTRAINT "FK_messages_senderId" 
            FOREIGN KEY ("senderId") REFERENCES "users"("id") 
            ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        // 인덱스
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_messages_conversationId" ON "messages" ("conversationId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_messages_senderId" ON "messages" ("senderId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_messages_isRead" ON "messages" ("isRead")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_messages_isRead"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_messages_senderId"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_messages_conversationId"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_messages_senderId"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_messages_conversationId"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT IF EXISTS "FK_conversations_participant2Id"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT IF EXISTS "FK_conversations_participant1Id"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "messages"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "conversations"`);
    }
}
