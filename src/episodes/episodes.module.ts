// src/episodes/episodes.module.ts
import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../prisma.service';
import { CharactersService } from 'src/characters/characters.service';
@Module({
  imports: [HttpModule],
  controllers: [EpisodesController],
  providers: [EpisodesService, PrismaService,CharactersService],
  exports: [EpisodesService,CharactersService],
})
export class EpisodesModule {}
