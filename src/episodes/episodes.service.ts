import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { EpisodeEntity } from './entities/episode.entity';
import { Episode } from '@prisma/client';

@Injectable()
export class EpisodesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async findAllEpisodes(): Promise<EpisodeEntity[] | Object> {
    const response = await lastValueFrom(this.httpService.get('https://rickandmortyapi.com/api/episode'));
    const apiEpisodes = response.data.results;

    const statusMap = new Map<string, number>();
    const statuses = await this.prisma.status.findMany({ where: { statusTypeId: 2 } });

    for (const status of statuses) {
      statusMap.set(status.name, status.id);
    }

    for (const episode of apiEpisodes) {
      const characterUrls = episode.characters;

      const characterConnectOrCreate = characterUrls.map((url: string) => ({
        where: { url },
        create: {
          url,
          name: 'Unknown',
        },
      }));

      const statusId = statusMap.get(episode.status) || Math.floor(Math.random() * 2) + 3;

      await this.prisma.episode.upsert({
        where: { url: episode.url },
        update: {
          name: episode.name || undefined,
          air_date: episode.air_date || undefined,
          episode: episode.episode || undefined,
          url: episode.url || undefined,
          created: episode.created || undefined,
          statusId: statusId,
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
          characters: {
            connectOrCreate: characterConnectOrCreate,
          },
        },
      });
    }

    return this.prisma.episode.findMany({
      include: {
        characters: true,
      },
    });
  }

  async createEpisode(episode: EpisodeEntity): Promise<Episode> {
    const statusId = episode.statusId || Math.floor(Math.random() * 2) + 3;

    const statusExists = await this.prisma.status.findUnique({
      where: { id: statusId },
    });

    if (!statusExists) {
      throw new Error('Status does not exist');
    }

    const characterUrls = episode.characters || [];

    const characterConnectOrCreate = characterUrls.map((url: string) => ({
      where: { url },
      create: {
        url,
        name: 'Unknown',
      },
    }));

    const newEpisode = await this.prisma.episode.create({
      data: {
        name: episode.name || null,
        air_date: episode.air_date || null,
        episode: episode.episode || null,
        url: episode.url || null,
        created: episode.created || null,
        statusId: statusId,
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
}
