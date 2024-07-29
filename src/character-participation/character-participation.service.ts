import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CharacterParticipationDto } from './dto/create-character-participation.dto';
import { generateRandomHour,generateRandomSeconds } from './helper';
@Injectable()
export class CharacterParticipationService {
  constructor(private readonly prisma:PrismaService){}

  

  async create(characterP: CharacterParticipationDto) {
    await this.prisma.characterEpisodeParticipation.create({
      data:{
        characterId:characterP.characterId,
            episodeId: characterP.episodeId,
            startTime: characterP.startTime,
            endTime: characterP.endTime,
      }
    })
  }

  
  async findAll() {
    const characters = await this.prisma.character.findMany({
      include: { episodes: true },
      orderBy: { id: 'asc' }
    });
  
    for (const character of characters) {
      for (const episode of character.episodes) {
        const { startTime, endTime } = generateRandomHour();
        const { startTimeS, endTimeS } = generateRandomSeconds();
  
        const startTimeStr = `${startTime}:${startTimeS}`;
        const endTimeStr = `${endTime}:${endTimeS}`;
  
        await this.prisma.characterEpisodeParticipation.upsert({
          where: {
            characterId_episodeId_startTime: { //manera de buscar varios elementos
              characterId: character.id,
              episodeId: episode.id,
              startTime: startTimeStr,
            },
          },
          update: {
            endTime: endTimeStr,
          },
          create: {
            characterId: character.id,
            episodeId: episode.id,
            startTime: startTimeStr,
            endTime: endTimeStr,
          },
        });
      }
    }
  
    return this.prisma.characterEpisodeParticipation.findMany();
  }
  

  async findOne(id: number) {
    return await this.prisma.characterEpisodeParticipation.findUnique({
      where: {
        id: id
      },
    })
  }

  async update(id: number, charaterP: CharacterParticipationDto) {
    return await this.prisma.characterEpisodeParticipation.update({
      where: {id: id},
      data:{
        characterId: charaterP.characterId,
        episodeId: charaterP.episodeId,
        startTime: charaterP.startTime,
        endTime: charaterP.endTime
      }
    })
      
  }

  async remove(id: number) {
    const participationFound = await this.prisma.characterEpisodeParticipation.findUnique({
      where: { id },
    });
    if (!participationFound) return null;

    return this.prisma.characterEpisodeParticipation.delete({ where: { id } });
  }
}
