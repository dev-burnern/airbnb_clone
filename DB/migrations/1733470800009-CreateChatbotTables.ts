import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChatbotTables1733470800009 implements MigrationInterface {
    name = 'CreateChatbotTables1733470800009';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // chatbot 테이블
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "chatbot" (
                "chatbot_id" SERIAL NOT NULL,
                "message" text NOT NULL,
                "intent" character varying(255) NOT NULL,
                "ai_answer" text NOT NULL,
                "ticket_id" integer NOT NULL,
                "email" character varying(100),
                "status" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_chatbot" PRIMARY KEY ("chatbot_id")
            )
        `);

        // chatbot_session 테이블
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "chatbot_session" (
                "session_id" SERIAL NOT NULL,
                "started_at" TIMESTAMP NOT NULL,
                "ended_at" TIMESTAMP NOT NULL,
                "status" text,
                "chatbot_id" integer NOT NULL,
                "user_id" uuid NOT NULL,
                CONSTRAINT "PK_chatbot_session" PRIMARY KEY ("session_id"),
                CONSTRAINT "FK_chatbot_session_user_id" FOREIGN KEY ("user_id") 
                    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
            )
        `);

        // chatbot_logs 테이블
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "chatbot_logs" (
                "log_id" SERIAL NOT NULL,
                "request_text" text NOT NULL,
                "response_text" text NOT NULL,
                "response_status" text NOT NULL,
                "response_time" float,
                "chatbot_id" integer NOT NULL,
                "session_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_chatbot_logs" PRIMARY KEY ("log_id")
            )
        `);

        // chat_messages 테이블 (챗봇용)
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "chat_messages" (
                "message_id" SERIAL NOT NULL,
                "message_text" text NOT NULL,
                "message_type" character varying(50) NOT NULL,
                "is_read" boolean,
                "status" text,
                "session_id" integer NOT NULL,
                "chatbot_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_chat_messages" PRIMARY KEY ("message_id")
            )
        `);

        // Foreign Keys
        await queryRunner.query(`
            ALTER TABLE "chatbot_session" 
            ADD CONSTRAINT "FK_chatbot_session_chatbot_id" 
            FOREIGN KEY ("chatbot_id") REFERENCES "chatbot"("chatbot_id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "chatbot_logs" 
            ADD CONSTRAINT "FK_chatbot_logs_chatbot_id" 
            FOREIGN KEY ("chatbot_id") REFERENCES "chatbot"("chatbot_id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "chatbot_logs" 
            ADD CONSTRAINT "FK_chatbot_logs_session_id" 
            FOREIGN KEY ("session_id") REFERENCES "chatbot_session"("session_id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "chat_messages" 
            ADD CONSTRAINT "FK_chat_messages_session_id" 
            FOREIGN KEY ("session_id") REFERENCES "chatbot_session"("session_id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "chat_messages" 
            ADD CONSTRAINT "FK_chat_messages_chatbot_id" 
            FOREIGN KEY ("chatbot_id") REFERENCES "chatbot"("chatbot_id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        // 인덱스
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_chatbot_session_chatbot_id" ON "chatbot_session" ("chatbot_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_chatbot_session_user_id" ON "chatbot_session" ("user_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_chatbot_logs_session_id" ON "chatbot_logs" ("session_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_chat_messages_session_id" ON "chat_messages" ("session_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_chat_messages_session_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_chatbot_logs_session_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_chatbot_session_user_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_chatbot_session_chatbot_id"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT IF EXISTS "FK_chat_messages_chatbot_id"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT IF EXISTS "FK_chat_messages_session_id"`);
        await queryRunner.query(`ALTER TABLE "chatbot_logs" DROP CONSTRAINT IF EXISTS "FK_chatbot_logs_session_id"`);
        await queryRunner.query(`ALTER TABLE "chatbot_logs" DROP CONSTRAINT IF EXISTS "FK_chatbot_logs_chatbot_id"`);
        await queryRunner.query(`ALTER TABLE "chatbot_session" DROP CONSTRAINT IF EXISTS "FK_chatbot_session_chatbot_id"`);
        await queryRunner.query(`ALTER TABLE "chatbot_session" DROP CONSTRAINT IF EXISTS "FK_chatbot_session_user_id"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "chat_messages"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "chatbot_logs"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "chatbot_session"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "chatbot"`);
    }
}
