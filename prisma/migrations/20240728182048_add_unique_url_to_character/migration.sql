/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Character_url_key" ON "Character"("url");
