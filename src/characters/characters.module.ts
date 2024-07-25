import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { PrismaService } from '../prisma.service'; 

@Module({
  imports: [HttpModule],
  providers: [CharactersService, PrismaService],
  controllers: [CharactersController],
})
export class CharactersModule {}
