/*
  Warnings:

  - A unique constraint covering the columns `[name,statusTypeId]` on the table `Status` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Status_name_statusTypeId_key" ON "Status"("name", "statusTypeId");
