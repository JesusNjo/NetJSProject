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
    // Asegúrate de que el statusTypeId esté configurado correctamente
    if (character.statusTypeId) {
      // Verifica si el statusTypeId existe en la tabla StatusType
      const statusTypeExists = await this.prisma.statusType.findUnique({
        where: { id: character.statusTypeId }
      });
  
      if (!statusTypeExists) {
        throw new Error(`StatusType with id ${character.statusTypeId} does not exist`);
      }
    }
  
    // Crea el nuevo personaje usando el statusId en lugar del status
    const newCharacter = await this.prisma.character.create({
      data: {
        name: character.name,
        statusId: character.statusTypeId, 
        species: character.species,
        type: character.type,
        gender: character.gender,
        origin: character.origin,
        location: character.location,
        image: character.image
      },
    });
  
    return newCharacter;
  }
  

  async findAllCharacters(): Promise<CharacterEntity[]> {
    const response = await lastValueFrom(this.httpService.get('https://rickandmortyapi.com/api/character'));
    const apiCharacters = response.data.results;
  
    // Mapeo de status a statusId
    const statusMap = new Map<string, number>();
    const statuses = await this.prisma.status.findMany();  // Cambia statusType por status
  
    for (const status of statuses) {
      statusMap.set(status.name, status.id);  // Usa status.name en lugar de statusType.type
    }
  
    for (const character of apiCharacters) {
      // Obtén el statusId usando el status de la API
      const statusId = statusMap.get(character.status) || null;
  
      // Si el status no existe en la tabla Status, agrégalo
      if (!statusId) {
        const newStatus = await this.prisma.status.create({
          data: {
            name: character.status,
            statusTypeId: 1  // Ajusta según sea necesario, puede ser un valor por defecto
          },
        });
        statusMap.set(character.status, newStatus.id);
      }
  
      await this.prisma.character.upsert({
        where: { id: character.id },
        update: {
          name: character.name,
          statusId: statusMap.get(character.status),  // Usa statusId aquí
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
          statusId: statusMap.get(character.status),  // Usa statusId aquí
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
        statusId: character.statusTypeId || current.statusId,  // Usar statusId en lugar de status
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
