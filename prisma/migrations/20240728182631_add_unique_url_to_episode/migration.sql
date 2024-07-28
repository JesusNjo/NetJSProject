/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Episode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Episode_url_key" ON "Episode"("url");
