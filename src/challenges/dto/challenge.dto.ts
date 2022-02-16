import { PartialType } from '@nestjs/mapped-types';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { CreateCategoriesDTO } from 'src/categories/dto/catagories.dto';
import { Player } from 'src/players/interfaces/player.interface';
import { Result } from '../interfaces/challenge.interface';

export class CreateChallengeDTO {
  @IsNotEmpty()
  @IsDateString()
  dateTime: Date;

  @IsNotEmpty()
  challenging: Player;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: Player[];
}

export class UpdateChallengeDTO {
  @IsDateString()
  @IsOptional()
  dateTime?: Date;

  @IsString()
  @IsOptional()
  status?: string;
}

export class AddMatchChallengeDTO {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Result[];
}
