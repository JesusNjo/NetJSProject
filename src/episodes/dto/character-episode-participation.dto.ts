import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CharacterEpisodeParticipationDto {
  @ApiProperty({ example: '10:32' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '11:36' })
  @IsString()
  @IsNotEmpty()
  endTime: string;
}
