import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreatePlayerDTO {
  @IsNotEmpty()
  readonly cellPhone: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly name: string;
}

export class UpdatePlayerDTO extends PartialType(CreatePlayerDTO) {}
