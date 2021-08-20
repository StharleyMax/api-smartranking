import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  ValidationPipe,
  UsePipes,
  Param,
  Put,
} from '@nestjs/common';

import { CreatePlayerDTO, UpdatePlayerDTO } from './dto/players.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';
import { PlayersValidationParamsPipe } from '../common/pipe/validation-params-pipe';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async Create(@Body() createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    return await this.playersService.create(createPlayerDTO);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() updatePlayerDTO: UpdatePlayerDTO,
    @Param('_id', PlayersValidationParamsPipe) _id: string,
  ): Promise<Player> {
    return await this.playersService.update(_id, updatePlayerDTO);
  }

  @Get()
  async findPlayers(): Promise<Player[]> {
    return await this.playersService.find();
  }

  @Get('/:_id')
  async findId(
    @Param('_id', PlayersValidationParamsPipe) _id: string,
  ): Promise<Player> {
    return await this.playersService.findById(_id);
  }

  @Delete('/:_id')
  async remove(@Param('_id', PlayersValidationParamsPipe) _id: string) {
    await this.playersService.remove(_id);
  }
}
