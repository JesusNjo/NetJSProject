import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { EpisodeEntity } from './entity/episode.entity';
import { Response } from 'express';

@Controller('episode')
export class EpisodeController {


    constructor(private readonly episodeService:EpisodeService){};

    @Get()
    async getAllEpisode(@Res() res:Response):Promise<EpisodeEntity[] | Object>{
        try {
            const episodes = await this.episodeService.findAll();
            if(episodes ==0) return res.status(HttpStatus.NO_CONTENT).json({message:'Not content'});
            return res.status(200).json(episodes);
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }
}
