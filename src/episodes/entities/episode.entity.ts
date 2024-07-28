import { IsString, IsArray, IsOptional, IsDateString, IsInt } from 'class-validator';

export class EpisodeEntity {
  @IsString()
  name: string;

  @IsString()
  air_date: string;

  @IsString()
  episode: string;

  @IsString()
  url: string;

  @IsArray()
  @IsString({ each: true })
  characters: string[];

  @IsOptional()
  @IsDateString()
  created?: string;

  @IsOptional()
  @IsInt()
  statusId?: number; 

  @IsInt()
  duration?: number;
}
