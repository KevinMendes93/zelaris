import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterContaBancariaTipoContaNotNull1772117275175 implements MigrationInterface {
  name = 'AlterContaBancariaTipoContaNotNull1772117275175';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conta_bancaria" ALTER COLUMN "tipoConta" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conta_bancaria" ALTER COLUMN "tipoConta" DROP NOT NULL`,
    );
  }
}
