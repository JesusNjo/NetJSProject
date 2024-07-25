import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { EpisodeEntity } from './entity/episode.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { json } from 'stream/consumers';

@Injectable()
export class EpisodeService {

    constructor(private readonly prisma:PrismaService,/*httpService:HttpService*/){}

    async findAll() {
        const response = await fetch('https://rickandmortyapi.com/api/episode');
        const data = await response.json();
        console.log(data);
        
      
        return data.results;
      }
      


}
