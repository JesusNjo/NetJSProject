import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res } from '@nestjs/common';
import { CharacterParticipationService } from './character-participation.service';
import { CharacterParticipationDto } from './dto/create-character-participation.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('character-participation')
@Controller('character-participation')
export class CharacterParticipationController {
  constructor(private readonly characterParticipationService: CharacterParticipationService) {}

  @Post()
  create(@Body() createCharacterParticipationDto: CharacterParticipationDto) {
    return this.characterParticipationService.create(createCharacterParticipationDto);
  }

  @Get()
  findAll() {
    return this.characterParticipationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number,@Res() res:Response):Promise<void> {
    try {
      const characters = await this.characterParticipationService.findOne(id)
      res.status(200).json(characters);
    } catch (error) {
      res.status(500).json({error:error})
    }
    
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() characterParticipationDto: CharacterParticipationDto) {
    return this.characterParticipationService.update(+id, characterParticipationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.characterParticipationService.remove(+id);
  }
}
