import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { EpisodeEntity } from './entities/episode.entity';

@Injectable()
export class EpisodesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService
  ) {}

  async upsertEpisodes(apiEpisodes: any[]) {
    for (const episode of apiEpisodes) {
      const characterUrls = episode.characters;

      await this.prisma.episode.upsert({
        where: { url: episode.url },
        update: {
          name: episode.name,
          air_date: episode.air_date,
          episode: episode.episode,
          url: episode.url,
          created: episode.created,
          statusId: episode.statusId,
          characters: {
            connectOrCreate: characterUrls.map((characterUrl: string) => ({
              where: { url: characterUrl },
              create: { url: characterUrl },
            })),
          },
        },
        create: {
          name: episode.name,
          air_date: episode.air_date,
          episode: episode.episode,
          url: episode.url,
          created: episode.created,
          statusId: episode.statusId,
          characters: {
            connectOrCreate: characterUrls.map((characterUrl: string) => ({
              where: { url: characterUrl },
              create: { url: characterUrl },
            })),
          },
        },
      });
    }
  }
  
  async findAll(): Promise<EpisodeEntity[] | Object> {
    const response = await lastValueFrom(this.httpService.get('https://rickandmortyapi.com/api/episode'));
    const apiEpisodes = response.data.results;
  
    const statusMap = new Map<string, number>();
    const statuses = await this.prisma.status.findMany({ where: { statusTypeId: 2 } });
  
    for (const status of statuses) {
      statusMap.set(status.name, status.id);
    }
  
    for (const episode of apiEpisodes) {
      // Extraer los URLs de los personajes
      const characterUrls = episode.characters.map((url: string) => ({
        where: { url },
        create: { url },
      }));
  
      // Obtener o asignar el statusId
      const statusId = statusMap.get(episode.status) || Math.floor(Math.random() * 2) + 3; // Solo 3 o 4
  
      await this.prisma.episode.upsert({
        where: { id: episode.id },
        update: {
          name: episode.name || undefined,
          air_date: episode.air_date || undefined,
          episode: episode.episode || undefined,
          url: episode.url || undefined,
          created: episode.created || undefined,
          statusId: statusId,
          characters: {
            connectOrCreate: characterUrls,
          },
        },
        create: {
          name: episode.name || null,
          air_date: episode.air_date || null,
          episode: episode.episode || null,
          url: episode.url || null,
          created: episode.created || null,
          statusId: statusId,
          characters: {
            connectOrCreate: characterUrls,
          },
        },
      });
    }
  
    return this.prisma.episode.findMany();
  }
  
}
