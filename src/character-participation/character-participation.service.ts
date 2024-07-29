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
  
        const existingParticipation = await this.prisma.characterEpisodeParticipation.findFirst({
          where: {
            characterId: character.id,
            episodeId: episode.id,
            startTime: startTimeStr,
          },
        });
  
        if (existingParticipation) {
          await this.prisma.characterEpisodeParticipation.update({
            where: { id: existingParticipation.id },
            data: { endTime: endTimeStr },
          });
        } else {
          await this.prisma.characterEpisodeParticipation.create({
            data: {
              characterId: character.id,
              episodeId: episode.id,
              startTime: startTimeStr,
              endTime: endTimeStr,
            },
          });
        }
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

  //Adicional
  async findParticipationByCharacterId(id:number){
    const characterFound = await this.prisma.character.findUnique({where : {id}})

    return this.prisma.characterEpisodeParticipation.findMany({where: {characterId:characterFound.id}});
  }

  async findParticipationByEpisodeId(id:number){
    const episodeFound = await this.prisma.episode.findUnique({where : {id}})

    return this.prisma.characterEpisodeParticipation.findMany({where: {episodeId:episodeFound.id}});
  }

  async deleteCharacterFromEpisode(characterId: number, episodeToDelete: number) {
    const participation = await this.prisma.characterEpisodeParticipation.findFirst({
      where: {
        characterId: characterId,
        episodeId: episodeToDelete,
      },
    });
  
    if (!participation) {
      throw new Error('Participation not found');
    }
  
    await this.prisma.characterEpisodeParticipation.delete({
      where: { id: participation.id },
    });
  
    return { message: 'El personaje ha sido eliminado del episodio correctamente' };
  }

  //Pagination

  async findAllPagination(page:number,size:number){
    if(size < 1 || page <1){
      throw new Error('Invalid page number or page size.');
    }
    
    const skip = (page - 1) * size;

    return this.prisma.characterEpisodeParticipation.findMany({
      skip: skip,
      take: size,
      orderBy:{
        id : 'asc'
      }
    })
  }

  async findAllPaginationFive(page:number){
    if(page< 1){
      throw new Error('Invalid page number.');
    }

    const skip = (page -1) * 5;
    return this.prisma.characterEpisodeParticipation.findMany({
      skip: skip,
      take: 5,
      orderBy:{
        id: 'asc'
      }
    })
  }
}
