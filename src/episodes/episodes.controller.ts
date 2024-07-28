import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, ParseIntPipe, Put } from '@nestjs/common';
import { Response } from 'express';
import { EpisodesService } from './episodes.service';
import { EpisodeEntity } from './entities/episode.entity';
import { Episode } from '@prisma/client';

@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodeService: EpisodesService) {}

  @Get()
  async getAllEpisode(@Res() res: Response): Promise<EpisodeEntity[] | Object> {
    try {
      const episodes = await this.episodeService.findAllEpisodes();
      if (Array.isArray(episodes) && episodes.length === 0) {
        return res.status(HttpStatus.NO_CONTENT).json({ message: 'No content' });
      }
      return res.status(HttpStatus.OK).json(episodes);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Post()
  async createEpisode(@Res() res: Response, @Body() episode: EpisodeEntity): Promise<EpisodeEntity | Object> {
    try {
      const newEpisode = await this.episodeService.createEpisode(episode);
      return res.status(HttpStatus.CREATED).json(newEpisode);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Get(':id')
  async findEpisodeById(@Res() res: Response, @Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      const episodeFound = await this.episodeService.findEpisodeById(id);
      episodeFound ? res.status(200).json({ episodeFound }) : res.status(404).json({ message: 'Episode not found' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  @Delete(':id')
  async deleteEpisodeById(@Res() res: Response, @Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      const episodeDelete = await this.episodeService.deleteEpisodeById(id);
      episodeDelete ? res.status(200).json({ episodeDelete }) : res.status(404).json({ message: 'Episode not found' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  @Put(':id')
  async updateEpisodeById(@Res() res: Response, @Param('id', ParseIntPipe) id: number, @Body() episode: EpisodeEntity): Promise<void> {
    try {
      const updatedEpisode = await this.episodeService.updateEpisodeById(id, episode);
      if (!updatedEpisode) {
        res.status(404).json({ message: 'Episode not found.' });
      }
      res.status(200).json(updatedEpisode);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
