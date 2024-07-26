-- CreateTable
CREATE TABLE "StatusType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "StatusType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "statusTypeId" INTEGER NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "statusId" INTEGER,
    "species" TEXT,
    "type" TEXT,
    "gender" TEXT,
    "origin" TEXT,
    "location" TEXT,
    "image" TEXT,
    "url" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "air_date" TEXT NOT NULL,
    "episode" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created" TEXT NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CharacterEpisodes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StatusType_type_key" ON "StatusType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Status_name_statusTypeId_key" ON "Status"("name", "statusTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Character_url_key" ON "Character"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_url_key" ON "Episode"("url");

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterEpisodes_AB_unique" ON "_CharacterEpisodes"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterEpisodes_B_index" ON "_CharacterEpisodes"("B");

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_statusTypeId_fkey" FOREIGN KEY ("statusTypeId") REFERENCES "StatusType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterEpisodes" ADD CONSTRAINT "_CharacterEpisodes_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterEpisodes" ADD CONSTRAINT "_CharacterEpisodes_B_fkey" FOREIGN KEY ("B") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
