/*
  Warnings:

  - You are about to drop the column `status` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `statusTypeId` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `statusTypeId` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the `StatusType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `statusId` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Episode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_statusTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Episode" DROP CONSTRAINT "Episode_statusTypeId_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "status",
DROP COLUMN "statusTypeId",
ADD COLUMN     "statusId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "statusTypeId",
ADD COLUMN     "statusId" INTEGER NOT NULL,
ALTER COLUMN "created" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "StatusType";

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
