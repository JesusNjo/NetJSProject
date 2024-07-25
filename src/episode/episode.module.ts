import { Module } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { EpisodeController } from './episode.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [EpisodeController],
  providers: [EpisodeService, PrismaService],
  exports: [EpisodeService], 
})
export class EpisodeModule {}
