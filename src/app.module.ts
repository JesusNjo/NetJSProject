import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharactersModule } from './characters/characters.module';
import { EpisodesModule } from './episodes/episodes.module';
import { CharacterParticipationModule } from './character-participation/character-participation.module';

@Module({
  imports: [CharactersModule, EpisodesModule, CharacterParticipationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
