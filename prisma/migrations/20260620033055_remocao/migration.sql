-- DropIndex
DROP INDEX "uk_pessoa_nome";

-- DropIndex
DROP INDEX "uk_usuario_nome";

-- AlterTable
ALTER TABLE "auditorio" ALTER COLUMN "nome" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "fuso_horario" SET DATA TYPE VARCHAR(5);

-- AlterTable
ALTER TABLE "evento_tipo" ALTER COLUMN "horario" SET DATA TYPE VARCHAR(5);
