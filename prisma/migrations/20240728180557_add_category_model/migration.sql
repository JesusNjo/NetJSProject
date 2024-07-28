/*
  Warnings:

  - You are about to drop the column `url` on the `Character` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Character_url_key";

-- DropIndex
DROP INDEX "Episode_url_key";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "url";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
