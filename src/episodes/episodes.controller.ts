import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { EpisodeEntity } from './entities/episode.entity';

@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodeService: EpisodesService) {}



  @Get()
  async getAllEpisode(@Res() res: Response): Promise<EpisodeEntity[] | Object> {
    try {
      const episodes = await this.episodeService.findAll();
      if (Array.isArray(episodes) && episodes.length === 0) {
        return res.status(HttpStatus.NO_CONTENT).json({ message: 'No content' });
      }
      return res.status(HttpStatus.OK).json(episodes);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
  @Post()
  async createEpisode(@Res() res:Response,@Body() episode:EpisodeEntity):Promise<EpisodeEntity>{
    return 
  }
}

