import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, startWith } from 'rxjs';
import { EpisodeEntity } from './entities/episode.entity';
import { Episode } from '@prisma/client';
import { CharacterEpisodeParticipationDto } from './dto/character-episode-participation.dto';

@Injectable()
export class EpisodesService {
  constructor(
    private readonly prisma: PrismaService, // Cambiado a PrismaService
    private readonly httpService: HttpService,
  ) {}

  async findAllEpisodes(): Promise<any> {
    const response = await lastValueFrom(this.httpService.get('https://rickandmortyapi.com/api/episode'));
    const apiEpisodes = response.data.results;
  
    const statusMap = new Map<string, number>();
    const statuses = await this.prisma.status.findMany({ where: { statusTypeId: 2 } });
  
    for (const status of statuses) {
      statusMap.set(status.name, status.id);
    }
  
    const existingCharacters = await this.prisma.character.findMany({
      select: { url: true }
    });
    const existingCharacterUrls = new Set(existingCharacters.map(character => character.url));
  
    for (const episode of apiEpisodes) {
      
      const validCharacterUrls = episode.characters.filter((url: unknown) =>
        typeof url === 'string' && existingCharacterUrls.has(url)
      );
  
      const characterConnectOrCreate = validCharacterUrls.map((url: string) => ({
        where: { url: url },
        create: {
          url: url,
          name: 'Unknown',
        },
      }));
  
      const statusId = statusMap.get(episode.status) || Math.floor(Math.random() * 2) + 3;
      const defaultDuration = Math.floor(Math.random() * 41) + 20;

      const existingEpisode = await this.prisma.episode.findUnique({
        where: { url: episode.url }
      });

      let duration = existingEpisode && existingEpisode.duration > 0
      ? existingEpisode.duration 
      : (episode.duration && episode.duration > 0) 
        ? episode.duration
        : defaultDuration; 
        if (duration > 60) {
          duration = 60; 
        }
      await this.prisma.episode.upsert({
        where: { url: episode.url },
        update: {
          name: episode.name || undefined,
          air_date: episode.air_date || undefined,
          episode: episode.episode || undefined,
          url: episode.url || undefined,
          created: episode.created || undefined,
          statusId: statusId,
          duration: duration,
          characters: {
            connectOrCreate: characterConnectOrCreate,
          },
        },
        create: {
          name: episode.name || null,
          air_date: episode.air_date || null,
          episode: episode.episode || null,
          url: episode.url || null,
          created: episode.created || null,
          statusId: statusId,
          duration: duration,
          characters: {
            connectOrCreate: characterConnectOrCreate,
          },
        },
      });
    }
  
    return this.prisma.episode.findMany({
      orderBy: {id:'asc'},
      include: {
        characters: true,
      },
    });
  }
  
  

  async createEpisode(episode: any): Promise<any> {
    const statusId = episode.statusId || Math.floor(Math.random() * 2) + 3;

    const statusExists = await this.prisma.status.findUnique({
      where: { id: statusId },
    });

    if (!statusExists) {
      throw new Error('Status does not exist');
    }

    const characterUrls = episode.characters || [];

    const characterConnectOrCreate = characterUrls.map((url: string) => ({
      where: { url: url },
      create: {
        url: url,
        name: 'Unknown',
      },
    }));
    const duration = Math.floor(Math.random() * 41) + 20;
    const newEpisode = await this.prisma.episode.create({
      data: {
        
        name: episode.name || null,
        air_date: episode.air_date || null,
        episode: episode.episode || null,
        url: episode.url || null,
        created: episode.created || null,
        statusId: statusId,
        duration: episode.duration || duration ,
        characters: {
          connectOrCreate: characterConnectOrCreate,
        },
      },
    });

    return newEpisode;
  }

  async findEpisodeById(id: number): Promise<Episode> {
    const episode = await this.prisma.episode.findUnique({
      where: { id: id },
      include: {
        characters: true,
      },
    });
    if (!episode) {
      throw new NotFoundException('This episode does not exist.');
    }
    return episode;
  }

  async deleteEpisodeById(id: number): Promise<Episode> {
    const episodeToDelete = await this.prisma.episode.findUnique({
      where: { id },
    });
    if (!episodeToDelete) return null;

    return this.prisma.episode.delete({ where: { id } });
  }

  async updateEpisodeById(id: number, episode: EpisodeEntity): Promise<Episode> {
    const episodeToFind = await this.prisma.episode.findUnique({ where: { id } });
    if (!episodeToFind) {
      throw new Error(`Episode with id ${id} does not exist`);
    }

    const updatedEpisode = await this.prisma.episode.update({
      where: { id },
      data: {
        name: episode.name || episodeToFind.name,
        air_date: episode.air_date || episodeToFind.air_date,
        episode: episode.episode || episodeToFind.episode,
        url: episode.url || episodeToFind.url,
        created: episode.created || episodeToFind.url,
        statusId: episode.statusId <= 4 ? episode.statusId : Math.floor(Math.random() * 2) + 3 || episodeToFind.statusId,
        characters: {
          connectOrCreate: episode.characters.map((url: string) => ({
            where: { url },
            create: {
              url,
              name: 'Unknown',
            },
          })),
        },
      },
    });
    return updatedEpisode;
  }


  async createParticipation(data: CharacterEpisodeParticipationDto, characterId: number, episodeId: number) {
    return this.prisma.characterEpisodeParticipation.create({
      data: {
        characterId,
        episodeId,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
  }

  //Requerimientos

  async findEpisodesBySeason(season:string):Promise<any>{
   // const seasons = await this.prisma.subCategory.findMany({ where: { categoryId: 2 } });
   const seasons =await this.prisma.episode.findMany({where : {episode:{startsWith:season},},orderBy:{id : 'asc'}})
  
    return seasons.length== 0 ? [] : seasons;
  }

  //Pagination

  async findEpisodesPagination(page:number,size:number):Promise<Episode[]>{
    if(page <1 || size<1){
      throw new Error('Invalid page number or page size.');
    }

    const skip = (page -1 ) * size;

    return this.prisma.episode.findMany({
      skip: skip,
      take: size,
      orderBy: {
        id: 'asc',
      },
    });
  }
}
