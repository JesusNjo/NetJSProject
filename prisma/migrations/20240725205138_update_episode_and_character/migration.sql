/*
  Warnings:

  - You are about to drop the column `title` on the `Episode` table. All the data in the column will be lost.
  - Added the required column `air_date` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `episode` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Episode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "title",
ADD COLUMN     "air_date" TEXT NOT NULL,
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "episode" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
