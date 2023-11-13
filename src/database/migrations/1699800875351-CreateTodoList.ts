import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodoList1699800875351 implements MigrationInterface {
  name = 'CreateTodoList1699800875351';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "todo_list" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_1a5448d48035763b9dbab86555b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_28559dd3f62a0b4c8c59dee362" ON "todo_list" ("title") `,
    );
    await queryRunner.query(
      `ALTER TABLE "todo_list" ADD CONSTRAINT "FK_0ccba8168dcb33ca73fd63e0c73" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "todo_list" DROP CONSTRAINT "FK_0ccba8168dcb33ca73fd63e0c73"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_28559dd3f62a0b4c8c59dee362"`,
    );
    await queryRunner.query(`DROP TABLE "todo_list"`);
  }
}
