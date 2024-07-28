/*
  Warnings:

  - A unique constraint covering the columns `[name,species,type]` on the table `Character` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Character_name_species_type_key" ON "Character"("name", "species", "type");
