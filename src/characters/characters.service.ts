import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '../prisma.service';
import { Character } from '@prisma/client';
import { CharacterEntity } from './entity/character.entity';

@Injectable()
export class CharactersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}


  async createCharacter(character:CharacterEntity):Promise<CharacterEntity>{
    const newCharacter = this.prisma.character.create({
      data:{
        name:character.name,
        status:character.status,
        statusTypeId:character.statusTypeId,
        species: character.species,
        type: character.type,
        gender: character.gender,
        origin: character.origin,
        location: character.location,
        image: character.image
      },
    })
    return newCharacter;
  }

  async findAllCharacters(): Promise<CharacterEntity[]> {
    const response = await lastValueFrom(this.httpService.get('https://rickandmortyapi.com/api/character'));
    const apiCharacters = response.data.results;
  
    // Mapeo de status a statusTypeId
    const statusMap = new Map<string, number>();
    const statusTypes = await this.prisma.statusType.findMany();
  
    for (const statusType of statusTypes) {
      statusMap.set(statusType.type, statusType.id);
    }
  
    for (const character of apiCharacters) {
      // Obtén el statusTypeId usando el status de la API
      const statusTypeId = statusMap.get(character.status) || null;
  
      // Si el status no existe en la tabla StatusType, agrégalo
      if (!statusTypeId) {
        const newStatusType = await this.prisma.statusType.create({
          data: { type: character.status },
        });
        statusMap.set(character.status, newStatusType.id);
      }
  
      await this.prisma.character.upsert({
        where: { id: character.id },
        update: {
          name: character.name,
          status: character.status, 
          statusTypeId: statusMap.get(character.status),
          species: character.species,
          type: character.type,
          gender: character.gender,
          origin: character.origin.name,
          location: character.location.name,
          image: character.image,
        },
        create: {
          id: character.id,
          name: character.name,
          status: character.status, 
          statusTypeId: statusMap.get(character.status),
          species: character.species,
          type: character.type,
          gender: character.gender,
          origin: character.origin.name,
          location: character.location.name,
          image: character.image,
        },
      });
    }
  
    return this.prisma.character.findMany();
  }
  

  async findCharacterById(id: number): Promise<CharacterEntity | null> {
    try {
      return await this.prisma.character.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('Error in findCharacterById:', error);
      throw new Error('Error fetching character');
    }
  }

  async deleteCharacterById(id:number):Promise<CharacterEntity>{
    const characterFound = await this.prisma.character.findUnique({
      where: {id},
    })
    if(!characterFound) return null;

    return this.prisma.character.delete({where: {id},})
  }

  async updateCharacterById(id: number, character: CharacterEntity): Promise<Character> {
    const current = await this.prisma.character.findUnique({where : {id}})
    const characterToModify = await this.prisma.character.update({
      where: {id},
      data:{
       name: character.name || current.name,
       status: character.status|| current.status,
       species: character.species||current.species,
       type: character.type || current.type,
       gender: character.gender || current.gender,
       origin: character.origin || current.origin,
       location: character.location || current.location,
       image: character.image || current.image
      }
    });
    return characterToModify;
  }
}
