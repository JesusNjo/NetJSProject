import { IsOptional, IsInt, IsString } from 'class-validator';

export class CharacterEntity {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  status?: string;  // Mantén status como string

  @IsOptional()
  @IsInt()
  statusTypeId?: number;  // Agrega el campo statusTypeId para la relación con StatusType

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
}
