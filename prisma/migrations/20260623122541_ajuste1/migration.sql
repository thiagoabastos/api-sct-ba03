/*
  Warnings:

  - You are about to drop the `checklist` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `titulo` to the `tutorial` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "checklist" DROP CONSTRAINT "fk_checklist_organizar_carro";

-- AlterTable
ALTER TABLE "auditorio" ALTER COLUMN "fuso_horario" SET DEFAULT '+00:00',
ALTER COLUMN "fuso_horario" SET DATA TYPE VARCHAR(6);

-- AlterTable
ALTER TABLE "tutorial" ADD COLUMN     "titulo" VARCHAR(50) NOT NULL,
ALTER COLUMN "texto" SET DATA TYPE VARCHAR(500);

-- DropTable
DROP TABLE "checklist";
