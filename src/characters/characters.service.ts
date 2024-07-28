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

  async createCharacter(character: CharacterEntity): Promise<Character> {
    const statusExists = await this.prisma.status.findUnique({
      where: { id: character.statusId },
    });
  
    if (!statusExists) {
      throw new Error(`Status with ID ${character.statusId} does not exist.`);
    }
  
    const newCharacter = await this.prisma.character.create({
      data: {
        name: character.name,
        statusId: character.statusId || Math.floor(Math.random() * 2) + 1,
        species: character.species,
        type: character.type,
        gender: character.gender,
        origin: character.origin,
        location: character.location,
        image: character.image,
        url : character.url
      },
    });
  
    return newCharacter;
  }
  
  
  
  

  async findAllCharacters(): Promise<CharacterEntity[]> {
    const response = await lastValueFrom(this.httpService.get('https://rickandmortyapi.com/api/character'));
    const apiCharacters = response.data.results;
    
    const statusMap = new Map<string, number>();
    const statuses = await this.prisma.status.findMany({ where: { statusTypeId: 1 } });
  
    for (const status of statuses) {
      statusMap.set(status.name, status.id);
    }
    
    for (const character of apiCharacters) {
      const statusId = statusMap.get(character.status) || null;
  
      await this.prisma.character.upsert({
        where: { id: character.id },
        update: {
          name: character.name || undefined,
          statusId: statusId || Math.floor(Math.random() * 2) + 1,
          species: character.species || undefined,
          type: character.type || undefined,
          gender: character.gender || undefined,
          origin: character.origin?.name || null,
          location: character.location?.name || null,
          image: character.image || undefined,
          url: character.url
        },
        create: {
          name: character.name || 'Unknown',
          statusId: statusId || Math.floor(Math.random() * 2) + 1,
          species: character.species || 'Unknown',
          type: character.type || 'Unknown',
          gender: character.gender || 'Unknown',
          origin: character.origin?.name || null,
          location: character.location?.name || null,
          image: character.image || null,
          url: character.url
        }
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

  async deleteCharacterById(id: number): Promise<Character | null> {
    const characterFound = await this.prisma.character.findUnique({
      where: { id },
    });
    if (!characterFound) return null;

    return this.prisma.character.delete({ where: { id } });
  }

  async updateCharacterById(id: number, character: CharacterEntity): Promise<Character> {
    const current = await this.prisma.character.findUnique({ where: { id } });

    if (!current) {
      throw new Error(`Character with id ${id} does not exist`);
    }

    const characterToModify = await this.prisma.character.update({
      where: { id },
      data: {
        name: character.name || current.name,
        statusId: character.statusId || current.statusId,
        species: character.species || current.species,
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
