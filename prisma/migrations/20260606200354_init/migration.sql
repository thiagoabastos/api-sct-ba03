/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('assembleia', 'congresso');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('pendente', 'pago');

-- CreateEnum
CREATE TYPE "AvaliacaoMotorista" AS ENUM ('EXCELENTE', 'BOA', 'REGULAR', 'MA');

-- CreateEnum
CREATE TYPE "AvaliacaoVeiculo" AS ENUM ('EXCELENTE', 'BOA', 'REGULAR', 'PESSIMA');

-- CreateEnum
CREATE TYPE "SimNao" AS ENUM ('SIM', 'NAO');

-- CreateEnum
CREATE TYPE "VelocidadeTrafego" AS ENUM ('DENTRO_DO_PERMITIDO', 'ACIMA_DO_PERMITIDO');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "congregacoes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "congregacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apanha" (
    "id" SERIAL NOT NULL,
    "local" VARCHAR(200) NOT NULL,
    "congregacao_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoas" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "congregacao_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_usuarios" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(20) NOT NULL,
    "descricao" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissoes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "celular" VARCHAR(15),
    "senha" VARCHAR(255),
    "senha_create" TIMESTAMP(3),
    "congregacao_id" INTEGER NOT NULL,
    "tipos_usuarios_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios_tipos_permissoes" (
    "usuario_tipo_id" INTEGER NOT NULL,
    "permissao_id" INTEGER NOT NULL,

    CONSTRAINT "usuarios_tipos_permissoes_pkey" PRIMARY KEY ("usuario_tipo_id","permissao_id")
);

-- CreateTable
CREATE TABLE "tutorial" (
    "id" SERIAL NOT NULL,
    "tipo_usuario_id" INTEGER,
    "texto" VARCHAR(300),
    "video" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento_tipo" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(60) NOT NULL,
    "tipo" "TipoEvento" NOT NULL,
    "horario" VARCHAR(2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evento_tipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditorio" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(2) NOT NULL,
    "fuso_horario" VARCHAR(2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auditorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" SERIAL NOT NULL,
    "evento_tipo_id" INTEGER NOT NULL,
    "auditorio_id" INTEGER,
    "ano" VARCHAR(4) NOT NULL,
    "valor" DECIMAL(5,2),
    "data_evento" DATE,
    "data_limite_nome" DATE,
    "data_limite_pagamento" DATE,
    "data_limite_deposito" DATE,
    "horario_saida_onibus" VARCHAR(5),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_congregacoes" (
    "evento_id" INTEGER NOT NULL,
    "congregacao_id" INTEGER NOT NULL,

    CONSTRAINT "eventos_congregacoes_pkey" PRIMARY KEY ("evento_id","congregacao_id")
);

-- CreateTable
CREATE TABLE "arranjo_congregacao" (
    "id" SERIAL NOT NULL,
    "congregacao_id" INTEGER NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "status" "StatusPagamento" NOT NULL DEFAULT 'pendente',
    "data_pago" DATE,
    "observacoes" VARCHAR(255),
    "criado_por" INTEGER,
    "atualizado_por" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "arranjo_congregacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nomes_arranjo_congregacao" (
    "id" SERIAL NOT NULL,
    "pessoa_id" INTEGER NOT NULL,
    "arranjo_congregacao_id" INTEGER NOT NULL,
    "menor_idade" BOOLEAN NOT NULL DEFAULT false,
    "sexta" BOOLEAN NOT NULL DEFAULT false,
    "sabado" BOOLEAN NOT NULL DEFAULT false,
    "domingo" BOOLEAN NOT NULL DEFAULT false,
    "carro" VARCHAR(2),
    "carro_sexta" VARCHAR(2),
    "carro_sabado" VARCHAR(2),
    "carro_domingo" VARCHAR(2),
    "ida" BOOLEAN NOT NULL DEFAULT false,
    "ida_sexta" BOOLEAN NOT NULL DEFAULT false,
    "ida_sabado" BOOLEAN NOT NULL DEFAULT false,
    "ida_domingo" BOOLEAN NOT NULL DEFAULT false,
    "volta" BOOLEAN NOT NULL DEFAULT false,
    "volta_sexta" BOOLEAN NOT NULL DEFAULT false,
    "volta_sabado" BOOLEAN NOT NULL DEFAULT false,
    "volta_domingo" BOOLEAN NOT NULL DEFAULT false,
    "observacao" VARCHAR(255),
    "observacao_sexta" VARCHAR(255),
    "observacao_sabado" VARCHAR(255),
    "observacao_domingo" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nomes_arranjo_congregacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formas_pagamento" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formas_pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos_arranjo_congregacao" (
    "id" SERIAL NOT NULL,
    "arranjo_congregacao_id" INTEGER NOT NULL,
    "forma_pagamento_id" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentos_arranjo_congregacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizar_carros" (
    "id" SERIAL NOT NULL,
    "capitao_id" INTEGER,
    "evento_id" INTEGER NOT NULL,
    "congregacao_id" INTEGER NOT NULL,
    "carro" VARCHAR(2),
    "dia" VARCHAR(10),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizar_carros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizar_carros_apanha" (
    "organizar_carros_id" INTEGER NOT NULL,
    "apanha_id" INTEGER NOT NULL,

    CONSTRAINT "organizar_carros_apanha_pkey" PRIMARY KEY ("organizar_carros_id","apanha_id")
);

-- CreateTable
CREATE TABLE "checklist" (
    "id" SERIAL NOT NULL,
    "organizar_carros_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "controle_qualidade" (
    "id" SERIAL NOT NULL,
    "organizar_carros_id" INTEGER NOT NULL,
    "empresa" VARCHAR(20),
    "placa" VARCHAR(10),
    "numero_onibus" VARCHAR(10),
    "motorista" VARCHAR(50),
    "telefone_motorista" VARCHAR(20),
    "aparencia__motorista" "AvaliacaoMotorista",
    "educacao" "AvaliacaoMotorista" NOT NULL,
    "condicao_pneus" "AvaliacaoVeiculo",
    "limpeza_carro" "AvaliacaoVeiculo",
    "extintor_incendio_disponivel" "SimNao",
    "problemas_quanto_horario" "SimNao",
    "pontos_embarque_problemas" "SimNao",
    "trafegou_acostamento" "SimNao",
    "velocidade_trafegou" "SimNao",
    "informacoes_adicionais_sugestoes" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "controle_qualidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(30) NOT NULL,
    "telefone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(100),
    "valor_onibus" DECIMAL(10,2),
    "valor_passagem" DECIMAL(10,2),
    "transferencia_bancaria" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "informacoes_gerais" (
    "id" SERIAL NOT NULL,
    "email_admin" VARCHAR(100) NOT NULL,
    "idade_minima_cobranca" INTEGER NOT NULL,

    CONSTRAINT "informacoes_gerais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_congregacao_nome" ON "congregacoes"("nome");

-- CreateIndex
CREATE INDEX "idx_apanha_congregacao_id" ON "apanha"("congregacao_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_pessoa_nome" ON "pessoas"("nome");

-- CreateIndex
CREATE INDEX "idx_pessoa_congregacao_id" ON "pessoas"("congregacao_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_tipo_usuario_nome" ON "tipos_usuarios"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "uk_permissao_nome" ON "permissoes"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "uk_usuario_nome" ON "usuarios"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "uk_usuario_email" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "idx_usuario_congregacao_id" ON "usuarios"("congregacao_id");

-- CreateIndex
CREATE INDEX "idx_usuario_tipo_usuario_id" ON "usuarios"("tipos_usuarios_id");

-- CreateIndex
CREATE INDEX "idx_usuario_tipo_permissao_usuario_tipo_id" ON "usuarios_tipos_permissoes"("usuario_tipo_id");

-- CreateIndex
CREATE INDEX "idx_usuario_tipo_permissao_permissao_id" ON "usuarios_tipos_permissoes"("permissao_id");

-- CreateIndex
CREATE INDEX "idx_tutorial_tipo_usuario_id" ON "tutorial"("tipo_usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_evento_tipo_nome" ON "evento_tipo"("nome");

-- CreateIndex
CREATE INDEX "idx_evento_evento_tipo_id" ON "eventos"("evento_tipo_id");

-- CreateIndex
CREATE INDEX "idx_evento_auditorio_id" ON "eventos"("auditorio_id");

-- CreateIndex
CREATE INDEX "idx_evento_congregacao_evento_congregacao" ON "eventos_congregacoes"("evento_id", "congregacao_id");

-- CreateIndex
CREATE INDEX "idx_arranjo_congregacao_evento_congregacao" ON "arranjo_congregacao"("evento_id", "congregacao_id");

-- CreateIndex
CREATE INDEX "idx_arranjo_congregacao_status" ON "arranjo_congregacao"("status");

-- CreateIndex
CREATE INDEX "idx_nome_arranjo_congregacao_pessoa_id" ON "nomes_arranjo_congregacao"("pessoa_id");

-- CreateIndex
CREATE INDEX "idx_nome_arranjo_congregacao_arranjo_congregacao_id" ON "nomes_arranjo_congregacao"("arranjo_congregacao_id");

-- CreateIndex
CREATE INDEX "idx_pagamento_arranjo_congregacao_arranjo_congregacao_id" ON "pagamentos_arranjo_congregacao"("arranjo_congregacao_id");

-- CreateIndex
CREATE INDEX "idx_pagamento_arranjo_congregacao_forma_pagamento_id" ON "pagamentos_arranjo_congregacao"("forma_pagamento_id");

-- CreateIndex
CREATE INDEX "idx_organizar_carro_evento_id" ON "organizar_carros"("evento_id");

-- CreateIndex
CREATE INDEX "idx_organizar_carro_congregacao_id" ON "organizar_carros"("congregacao_id");

-- CreateIndex
CREATE INDEX "idx_organizar_carro_apanha_organizar_carro_id" ON "organizar_carros_apanha"("organizar_carros_id");

-- CreateIndex
CREATE INDEX "idx_organizar_carro_apanha_apanha_id" ON "organizar_carros_apanha"("apanha_id");

-- CreateIndex
CREATE INDEX "idx_checklist_organizar_carro_id" ON "checklist"("organizar_carros_id");

-- CreateIndex
CREATE INDEX "idx_controle_qualidade_organizar_carro_id" ON "controle_qualidade"("organizar_carros_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_empresa_email" ON "empresas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "uk_documento_nome" ON "documentos"("nome");

-- AddForeignKey
ALTER TABLE "apanha" ADD CONSTRAINT "fk_apanha_congregacao" FOREIGN KEY ("congregacao_id") REFERENCES "congregacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas" ADD CONSTRAINT "fk_pessoa_congregacao" FOREIGN KEY ("congregacao_id") REFERENCES "congregacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "fk_usuario_congregacao" FOREIGN KEY ("congregacao_id") REFERENCES "congregacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "fk_usuario_tipo_usuario" FOREIGN KEY ("tipos_usuarios_id") REFERENCES "tipos_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_tipos_permissoes" ADD CONSTRAINT "fk_usuario_tipo_permissao_usuario_tipo" FOREIGN KEY ("usuario_tipo_id") REFERENCES "tipos_usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_tipos_permissoes" ADD CONSTRAINT "fk_usuario_tipo_permissao_permissao" FOREIGN KEY ("permissao_id") REFERENCES "permissoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutorial" ADD CONSTRAINT "fk_tutorial_tipo_usuario" FOREIGN KEY ("tipo_usuario_id") REFERENCES "tipos_usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "fk_evento_evento_tipo" FOREIGN KEY ("evento_tipo_id") REFERENCES "evento_tipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "fk_evento_auditorio" FOREIGN KEY ("auditorio_id") REFERENCES "auditorio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_congregacoes" ADD CONSTRAINT "fk_evento_congregacao_evento" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_congregacoes" ADD CONSTRAINT "fk_evento_congregacao_congregacao" FOREIGN KEY ("congregacao_id") REFERENCES "congregacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arranjo_congregacao" ADD CONSTRAINT "fk_arranjo_congregacao_congregacao" FOREIGN KEY ("congregacao_id") REFERENCES "congregacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arranjo_congregacao" ADD CONSTRAINT "fk_arranjo_congregacao_evento" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arranjo_congregacao" ADD CONSTRAINT "fk_arranjo_congregacao_criado_por" FOREIGN KEY ("criado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arranjo_congregacao" ADD CONSTRAINT "fk_arranjo_congregacao_atualizado_por" FOREIGN KEY ("atualizado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nomes_arranjo_congregacao" ADD CONSTRAINT "fk_nome_arranjo_congregacao_pessoa" FOREIGN KEY ("pessoa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nomes_arranjo_congregacao" ADD CONSTRAINT "fk_nome_arranjo_congregacao_arranjo_congregacao" FOREIGN KEY ("arranjo_congregacao_id") REFERENCES "arranjo_congregacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos_arranjo_congregacao" ADD CONSTRAINT "fk_pagamento_arranjo_congregacao_arranjo_congregacao" FOREIGN KEY ("arranjo_congregacao_id") REFERENCES "arranjo_congregacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos_arranjo_congregacao" ADD CONSTRAINT "fk_pagamento_arranjo_congregacao_forma_pagamento" FOREIGN KEY ("forma_pagamento_id") REFERENCES "formas_pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizar_carros" ADD CONSTRAINT "fk_organizar_carro_capitao" FOREIGN KEY ("capitao_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizar_carros" ADD CONSTRAINT "fk_organizar_carro_evento" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizar_carros" ADD CONSTRAINT "fk_organizar_carro_congregacao" FOREIGN KEY ("congregacao_id") REFERENCES "congregacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizar_carros_apanha" ADD CONSTRAINT "fk_organizar_carro_apanha_organizar_carro" FOREIGN KEY ("organizar_carros_id") REFERENCES "organizar_carros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizar_carros_apanha" ADD CONSTRAINT "fk_organizar_carro_apanha_apanha" FOREIGN KEY ("apanha_id") REFERENCES "apanha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist" ADD CONSTRAINT "fk_checklist_organizar_carro" FOREIGN KEY ("organizar_carros_id") REFERENCES "organizar_carros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "controle_qualidade" ADD CONSTRAINT "fk_controle_qualidade_organizar_carro" FOREIGN KEY ("organizar_carros_id") REFERENCES "organizar_carros"("id") ON DELETE CASCADE ON UPDATE CASCADE;
