import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

export class EpisodeEntity {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  air_date?: string;

  @IsOptional()
  @IsString()
  episode?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  created?: string;

  @IsOptional()
  @IsInt()
  statusId?: number;
}
