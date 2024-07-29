import { Module } from '@nestjs/common';
import { CharacterParticipationService } from './character-participation.service';
import { CharacterParticipationController } from './character-participation.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { CharactersService } from 'src/characters/characters.service';
import { EpisodesService } from 'src/episodes/episodes.service';

@Module({
  imports: [HttpModule],
  controllers: [CharacterParticipationController],
  providers: [CharacterParticipationService, CharactersService, EpisodesService, PrismaService],
  exports: [PrismaService],
})
export class CharacterParticipationModule {}
