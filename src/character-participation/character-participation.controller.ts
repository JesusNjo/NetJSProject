import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res, Put } from '@nestjs/common';
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

  @Put(':id')
  update(@Param('id',ParseIntPipe) id: number, @Body() characterParticipationDto: CharacterParticipationDto) {
    return this.characterParticipationService.update(id, characterParticipationDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.characterParticipationService.remove(id);
  }

  //Adicional
  @Get('character/:id')
  async findParticipationByCharacterId(@Param('id',ParseIntPipe) id:number,@Res() res:Response){
    try {
      const characterFound = await this.characterParticipationService.findParticipationByCharacterId(id);
      return characterFound!= null ? res.status(200).json(characterFound):res.status(404).json({message:'Character not found'});
      
    } catch (error) {
      res.status(500).json({message:error.message})
    }
  }

  @Get('episode/:id')
  async findParticipationByEpisodeId(@Param('id',ParseIntPipe) id:number,@Res() res:Response){
    try {
      const episodeFound = await this.characterParticipationService.findParticipationByEpisodeId(id);
      return episodeFound!= null ? res.status(200).json(episodeFound):res.status(404).json({message:'Episode not found'});
      
    } catch (error) {
      res.status(500).json({message:error.message})
    }
  }

  @Put('delete-char/:id/episode/:deleteF')
async deleteCharacterFromEpisode(
  @Param('id', ParseIntPipe) id: number,
  @Param('deleteF', ParseIntPipe) deleteF: number,
  @Res() res: Response
) {
  try {
    const result = await this.characterParticipationService.deleteCharacterFromEpisode(id, deleteF);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

  //Pagination

  @Get('/pagination/page/:page/size/:size')
  async findAllPagination(@Param('page',ParseIntPipe) page:number,@Param('size',ParseIntPipe) size:number,
  @Res() res:Response){
    try {
      const characterPPagination = await this.characterParticipationService.findAllPagination(page,size);
      return characterPPagination.length>0? res.status(200).json(characterPPagination):res.status(204).json({message:'Not content'});
    } catch (error) {
      res.status(500).json({message:error.message})
    }
  }
  @Get('/pagination/page/:page')
  async findAllPaginationFive(@Param('page',ParseIntPipe) page:number,
  @Res() res:Response){
    try {
      const characterPPagination = await this.characterParticipationService.findAllPaginationFive(page);
      return characterPPagination.length>0? res.status(200).json(characterPPagination):res.status(204).json({message:'Not content'});
    } catch (error) {
      res.status(500).json({message:error.message})
    }
  }
}
