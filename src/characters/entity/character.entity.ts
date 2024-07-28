import { IsOptional, IsInt, IsString } from 'class-validator';

export class CharacterEntity {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  statusId?: number;  

  @IsOptional()
  @IsString()
  species?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  url?: string; 
}
