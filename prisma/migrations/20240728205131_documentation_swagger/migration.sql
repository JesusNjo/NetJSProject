-- CreateTable
CREATE TABLE "CharacterEpisodeParticipation" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "CharacterEpisodeParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CharacterEpisodeParticipation_characterId_episodeId_startTi_key" ON "CharacterEpisodeParticipation"("characterId", "episodeId", "startTime");

-- AddForeignKey
ALTER TABLE "CharacterEpisodeParticipation" ADD CONSTRAINT "CharacterEpisodeParticipation_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterEpisodeParticipation" ADD CONSTRAINT "CharacterEpisodeParticipation_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
