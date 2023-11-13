import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodoItem1699864763921 implements MigrationInterface {
  name = 'CreateTodoItem1699864763921';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "todo_list" DROP CONSTRAINT "FK_0ccba8168dcb33ca73fd63e0c73"`,
    );
    await queryRunner.query(
      `CREATE TABLE "todo_item" ("id" SERIAL NOT NULL, "description" character varying, "isCompleted" boolean, "listId" integer, CONSTRAINT "PK_d454c4b9eac15cc27c2ed8e4138" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo_list" ADD CONSTRAINT "FK_0ccba8168dcb33ca73fd63e0c73" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo_item" ADD CONSTRAINT "FK_8d55427560be1f77fe42f541926" FOREIGN KEY ("listId") REFERENCES "todo_list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "todo_item" DROP CONSTRAINT "FK_8d55427560be1f77fe42f541926"`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo_list" DROP CONSTRAINT "FK_0ccba8168dcb33ca73fd63e0c73"`,
    );
    await queryRunner.query(`DROP TABLE "todo_item"`);
    await queryRunner.query(
      `ALTER TABLE "todo_list" ADD CONSTRAINT "FK_0ccba8168dcb33ca73fd63e0c73" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
