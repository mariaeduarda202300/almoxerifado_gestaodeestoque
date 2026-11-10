/*
  Warnings:

  - You are about to drop the column `precoUnitario` on the `ProdutoPedido` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `ProdutoPedido` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[matricula]` on the table `Funcionario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matricula` to the `Funcionario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Funcionario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Funcionario" ADD COLUMN     "matricula" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProdutoPedido" DROP COLUMN "precoUnitario",
DROP COLUMN "subtotal";

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_matricula_key" ON "Funcionario"("matricula");
