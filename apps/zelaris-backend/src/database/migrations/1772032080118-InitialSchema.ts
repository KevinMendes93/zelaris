import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1772032080118 implements MigrationInterface {
  name = 'InitialSchema1772032080118';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "endereco" ("id" BIGSERIAL NOT NULL, "numero" character varying(10), "endereco" character varying(100) NOT NULL, "bairro" character varying(50) NOT NULL, "municipio" character varying(50) NOT NULL, "uf" character varying(2) NOT NULL, "cep" character varying(10) NOT NULL, CONSTRAINT "PK_2a6880f71a7f8d1c677bb2a32a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."conta_bancaria_tipoconta_enum" AS ENUM('Corrente', 'Poupança', 'Salário')`,
    );
    await queryRunner.query(
      `CREATE TABLE "conta_bancaria" ("id" BIGSERIAL NOT NULL, "banco" character varying(100) NOT NULL, "agencia" character varying(10) NOT NULL, "agenciaDigito" character varying(2), "conta" character varying(20) NOT NULL, "contaDigito" character varying(2), "tipoConta" "public"."conta_bancaria_tipoconta_enum", "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ae03c5239215700fc0955d26787" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."anexo_funcionario_tipo_enum" AS ENUM('RG/CNH', 'Comprovante de Residência', 'Certidão de Nascimento', 'Certidão de Casamento', 'Comprovante de Escolaridade', 'Certificado de Reservista', 'Outro')`,
    );
    await queryRunner.query(
      `CREATE TABLE "anexo_funcionario" ("id" BIGSERIAL NOT NULL, "path" character varying NOT NULL, "originalName" character varying NOT NULL, "mimeType" character varying NOT NULL, "size" bigint NOT NULL, "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(), "tipo" "public"."anexo_funcionario_tipo_enum", "documentacaoId" bigint, CONSTRAINT "PK_c6c7ce96a48177afe01da44e724" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."documentacao_funcionario_orgaoemissor_enum" AS ENUM('SSP', 'DETRAN', 'POLITEC', 'Polícia Federal', 'POLITEC/MT', 'SESP', 'PM', 'PC', 'CGPI', 'DGPC', 'IFP', 'IML', 'SDS', 'SEJUSP')`,
    );
    await queryRunner.query(
      `CREATE TABLE "documentacao_funcionario" ("id" BIGSERIAL NOT NULL, "ctps" character varying(50), "serie" character varying(20), "pis" character varying(20), "identidade" character varying(20) NOT NULL, "orgaoEmissor" "public"."documentacao_funcionario_orgaoemissor_enum" NOT NULL, "dataEmissao" date NOT NULL, "tituloEleitor" character varying(20), "zonaEleitoral" character varying(10), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_10fcc5b3965ecd84103d200d8a4" UNIQUE ("ctps"), CONSTRAINT "UQ_476c96a0374bcb793a3fb9ceb2d" UNIQUE ("serie"), CONSTRAINT "UQ_35f04cb534b6801d8efdf1ba45d" UNIQUE ("pis"), CONSTRAINT "UQ_33198dd113d1da77eb686c6da77" UNIQUE ("identidade"), CONSTRAINT "UQ_bc6a5a3bcaefd867ad75818c5f5" UNIQUE ("tituloEleitor"), CONSTRAINT "PK_16710dfba53bcb8c08d714a9984" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcoes_tipopagamento_enum" AS ENUM('Mensal', 'Diaria')`,
    );
    await queryRunner.query(
      `CREATE TABLE "funcoes" ("id" BIGSERIAL NOT NULL, "nome" character varying(100) NOT NULL, "salario" double precision NOT NULL, "tipoPagamento" "public"."funcoes_tipopagamento_enum" NOT NULL DEFAULT 'Mensal', "anoVigente" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_48495eac66422a689003585fb88" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "clientes" ("id" BIGSERIAL NOT NULL, "nome" character varying(100) NOT NULL, "documento" character varying NOT NULL, "email" character varying NOT NULL, "telefone" character varying NOT NULL, "pessoaJuridica" boolean NOT NULL DEFAULT true, "ativo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "enderecoId" bigint, CONSTRAINT "UQ_fc002853c86bd15f82ef93bf42a" UNIQUE ("documento"), CONSTRAINT "UQ_3cd5652ab34ca1a0a2c7a255313" UNIQUE ("email"), CONSTRAINT "UQ_dd191c183fd43638cf41163ae25" UNIQUE ("telefone"), CONSTRAINT "PK_d76bf3571d906e4e86470482c08" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."servicos_status_enum" AS ENUM('AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO', 'CANCELADO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "servicos" ("id" BIGSERIAL NOT NULL, "descricao" character varying(1000) NOT NULL, "data_hora_inicio" TIMESTAMP WITH TIME ZONE NOT NULL, "data_hora_fim" TIMESTAMP WITH TIME ZONE, "valor" numeric(10,2) NOT NULL, "status" "public"."servicos_status_enum" NOT NULL DEFAULT 'AGENDADO', "observacao" character varying(1000), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "clienteId" bigint, CONSTRAINT "PK_91c99670ea2115d2028a48c5e0e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "alocacoes" ("id" BIGSERIAL NOT NULL, "data_hora_inicio" TIMESTAMP WITH TIME ZONE NOT NULL, "data_hora_fim" TIMESTAMP WITH TIME ZONE NOT NULL, "ft" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "servico_id" bigint, "funcionarioId" bigint, CONSTRAINT "PK_f8773c16f96cdcceb7a41a30905" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcionarios_grauinstrucao_enum" AS ENUM('Ensino Fundamental Incompleto', 'Ensino Fundamental Completo', 'Ensino Médio Incompleto', 'Ensino Médio Completo', 'Ensino Técnico Incompleto', 'Ensino Técnico Completo', 'Ensino Superior Incompleto', 'Ensino Superior Completo', 'Pós-graduação', 'Mestrado', 'Doutorado')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcionarios_estadocivil_enum" AS ENUM('Solteiro', 'Casado', 'Divorciado', 'Viúvo')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcionarios_tiposanguineo_enum" AS ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcionarios_modotrabalho_enum" AS ENUM('5/2', '12/36')`,
    );
    await queryRunner.query(
      `CREATE TABLE "funcionarios" ("id" BIGSERIAL NOT NULL, "freelancer" boolean NOT NULL DEFAULT false, "nome" character varying(100) NOT NULL, "dataNascimento" date NOT NULL, "telefone" character varying NOT NULL, "recado" character varying, "cpf" character varying NOT NULL, "email" character varying, "grauInstrucao" "public"."funcionarios_grauinstrucao_enum", "estadoCivil" "public"."funcionarios_estadocivil_enum", "tipoSanguineo" "public"."funcionarios_tiposanguineo_enum", "naturalidade" character varying(30), "nomePai" character varying(100), "nomeMae" character varying(100), "dependentesIR" integer, "filhosMenores14" integer, "modoTrabalho" "public"."funcionarios_modotrabalho_enum", "dataFimContratoExperiencia" date, "horarioInicio" TIME, "horarioFim" TIME, "dataEncerramento" date, "temValeTransporte" boolean NOT NULL DEFAULT false, "pix" character varying(255), "ativo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "enderecoId" bigint, "documentacaoId" bigint, "funcaoId" bigint, "contaBancariaId" bigint, CONSTRAINT "UQ_24a03e03cec5545d45edf78c606" UNIQUE ("telefone"), CONSTRAINT "UQ_a0de321e9da6c025e7fc92f0bd8" UNIQUE ("cpf"), CONSTRAINT "UQ_5536df94d421db7d1a1ba832f0f" UNIQUE ("email"), CONSTRAINT "REL_013b9e7517a06e7e6ea34d785d" UNIQUE ("documentacaoId"), CONSTRAINT "REL_5c811e48342116e8a0d52ea6d9" UNIQUE ("contaBancariaId"), CONSTRAINT "PK_a6ee7c0e30d968db531ad073337" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."vale_transporte_tipoconducao_enum" AS ENUM('Ida', 'Volta')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."vale_transporte_meiotransporte_enum" AS ENUM('Ônibus', 'Carro', 'Trem')`,
    );
    await queryRunner.query(
      `CREATE TABLE "vale_transporte" ("id" BIGSERIAL NOT NULL, "tipoConducao" "public"."vale_transporte_tipoconducao_enum" NOT NULL, "meioTransporte" "public"."vale_transporte_meiotransporte_enum" NOT NULL, "quantidade" integer NOT NULL, "valorUnitario" double precision NOT NULL, "valorTotal" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "funcionarioId" bigint, CONSTRAINT "PK_cf8933a8cc2221f7928dd07ac75" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_roles_enum" AS ENUM('USER', 'ADMIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" BIGSERIAL NOT NULL, "nome" character varying NOT NULL, "cpf" character varying NOT NULL, "senha" character varying NOT NULL, "email" character varying NOT NULL, "telefone" character varying, "roles" "public"."users_roles_enum" array NOT NULL DEFAULT '{USER}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE ("cpf"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "anexo_funcionario" ADD CONSTRAINT "FK_66818d16e0e26c296ee29a5344b" FOREIGN KEY ("documentacaoId") REFERENCES "documentacao_funcionario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "clientes" ADD CONSTRAINT "FK_48f7cdc8226d2eb16e9ba13df43" FOREIGN KEY ("enderecoId") REFERENCES "endereco"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "servicos" ADD CONSTRAINT "FK_d6b6b757ca5b9250cd1359af1be" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "alocacoes" ADD CONSTRAINT "FK_52399da345a46d79d350826b8a4" FOREIGN KEY ("servico_id") REFERENCES "servicos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "alocacoes" ADD CONSTRAINT "FK_db26a06654fc8e4ced2f857d5e8" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD CONSTRAINT "FK_50b142acdf0ff890b86b2b13ed8" FOREIGN KEY ("enderecoId") REFERENCES "endereco"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD CONSTRAINT "FK_013b9e7517a06e7e6ea34d785d6" FOREIGN KEY ("documentacaoId") REFERENCES "documentacao_funcionario"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD CONSTRAINT "FK_3e68a1f3b32c19016d6f951dcb1" FOREIGN KEY ("funcaoId") REFERENCES "funcoes"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD CONSTRAINT "FK_5c811e48342116e8a0d52ea6d99" FOREIGN KEY ("contaBancariaId") REFERENCES "conta_bancaria"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vale_transporte" ADD CONSTRAINT "FK_f0925dbd47eec7e282e7e9c982b" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vale_transporte" DROP CONSTRAINT "FK_f0925dbd47eec7e282e7e9c982b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP CONSTRAINT "FK_5c811e48342116e8a0d52ea6d99"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP CONSTRAINT "FK_3e68a1f3b32c19016d6f951dcb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP CONSTRAINT "FK_013b9e7517a06e7e6ea34d785d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP CONSTRAINT "FK_50b142acdf0ff890b86b2b13ed8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "alocacoes" DROP CONSTRAINT "FK_db26a06654fc8e4ced2f857d5e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "alocacoes" DROP CONSTRAINT "FK_52399da345a46d79d350826b8a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "servicos" DROP CONSTRAINT "FK_d6b6b757ca5b9250cd1359af1be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clientes" DROP CONSTRAINT "FK_48f7cdc8226d2eb16e9ba13df43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "anexo_funcionario" DROP CONSTRAINT "FK_66818d16e0e26c296ee29a5344b"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
    await queryRunner.query(`DROP TABLE "vale_transporte"`);
    await queryRunner.query(
      `DROP TYPE "public"."vale_transporte_meiotransporte_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."vale_transporte_tipoconducao_enum"`,
    );
    await queryRunner.query(`DROP TABLE "funcionarios"`);
    await queryRunner.query(
      `DROP TYPE "public"."funcionarios_modotrabalho_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."funcionarios_tiposanguineo_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."funcionarios_estadocivil_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."funcionarios_grauinstrucao_enum"`,
    );
    await queryRunner.query(`DROP TABLE "alocacoes"`);
    await queryRunner.query(`DROP TABLE "servicos"`);
    await queryRunner.query(`DROP TYPE "public"."servicos_status_enum"`);
    await queryRunner.query(`DROP TABLE "clientes"`);
    await queryRunner.query(`DROP TABLE "funcoes"`);
    await queryRunner.query(`DROP TYPE "public"."funcoes_tipopagamento_enum"`);
    await queryRunner.query(`DROP TABLE "documentacao_funcionario"`);
    await queryRunner.query(
      `DROP TYPE "public"."documentacao_funcionario_orgaoemissor_enum"`,
    );
    await queryRunner.query(`DROP TABLE "anexo_funcionario"`);
    await queryRunner.query(`DROP TYPE "public"."anexo_funcionario_tipo_enum"`);
    await queryRunner.query(`DROP TABLE "conta_bancaria"`);
    await queryRunner.query(
      `DROP TYPE "public"."conta_bancaria_tipoconta_enum"`,
    );
    await queryRunner.query(`DROP TABLE "endereco"`);
  }
}
