import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharactersModule } from './characters/characters.module';
import { EpisodesModule } from './episodes/episodes.module';

@Module({
  imports: [CharactersModule, EpisodesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
