import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CharacterParticipationDto {

  @IsInt()
  @IsNotEmpty()
  characterId: number;

  @IsInt()
  @IsNotEmpty()
  episodeId: number;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}
