-- CreateTable
CREATE TABLE "StatusType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "StatusType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statusTypeId" INTEGER NOT NULL,
    "species" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "statusTypeId" INTEGER NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StatusType_type_key" ON "StatusType"("type");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_statusTypeId_fkey" FOREIGN KEY ("statusTypeId") REFERENCES "StatusType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_statusTypeId_fkey" FOREIGN KEY ("statusTypeId") REFERENCES "StatusType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
