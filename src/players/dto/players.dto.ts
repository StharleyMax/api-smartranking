import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreatePlayer {
  @IsNotEmpty()
  readonly cellPhone: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly name: string;
}
