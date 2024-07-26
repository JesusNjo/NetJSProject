import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [EpisodesController],
  providers: [EpisodesService,PrismaService],
  exports: [EpisodesService]
})
export class EpisodesModule {}
