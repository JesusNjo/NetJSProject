import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Res } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { Response } from 'express';
import { CharacterEntity } from './entity/character.entity';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  async createCharacter(@Body() character: CharacterEntity, @Res() res: Response): Promise<CharacterEntity | Object> {
    try {
      const newCharacter = await this.charactersService.createCharacter(character);
      return res.status(201).json(newCharacter);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  @Get('/all')
  async getCharacters(@Res() res: Response): Promise<void> {
    try {
      const characters = await this.charactersService.findAllCharacters();
      res.status(200).json(characters);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  @Get(':id')
  async getCharacterById(@Param('id', ParseIntPipe) id: number): Promise<CharacterEntity | null> {
    return this.charactersService.findCharacterById(id);

  }

  @Delete(':id')
  async deleteCharacterById(@Param('id', ParseIntPipe) id: number, @Res() res: Response): Promise<CharacterEntity | any> {
    try {
      const characterFound = await this.charactersService.findCharacterById(id);
      if (!characterFound) return res.status(404).json({ message: 'Character not found!' });

      await this.charactersService.deleteCharacterById(id);
      return res.status(200).json(characterFound);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  @Put(':id')
  async updateCharacterById(@Body() character: CharacterEntity, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const updatedCharacter = await this.charactersService.updateCharacterById(id, character);
      return res.status(200).json(updatedCharacter);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  //Requerimientos

  @Get('/find-by-type/:type')
  async findCharactersByType(@Param('type') type: string, @Res() res: Response): Promise<void> {
    try {
      if (!type) {
        res.status(400).json({ message: 'Type query parameter is required' });
        return;
      }

      const characters = await this.charactersService.findCharactersByType(type);
      if (characters.length > 0) {
        res.status(200).json(characters);
      } else {
        res.status(204).json([]);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  @Get('/find-by-species/:species')
  async findCharacterBySpecie(@Param('species') species: string,@Res() res:Response):Promise<void>{
    try {
      if (!species) {
        res.status(400).json({ message: 'Specie query parameter is required' });
        return;
      }
      const characters = await this.charactersService.findCharacterBySpecie(species);
      if (characters.length > 0) {
        res.status(200).json(characters);
      } else {
        res.status(204).json([]);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } 

}
