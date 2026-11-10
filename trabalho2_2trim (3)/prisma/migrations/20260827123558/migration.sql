/*
  Warnings:

  - A unique constraint covering the columns `[descricao]` on the table `Produto` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Produto_descricao_key" ON "Produto"("descricao");
