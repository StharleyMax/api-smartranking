import { Controller, Post, Body, Get, Query, Delete } from '@nestjs/common';
import { CreatePlayer } from './dto/players.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async updateCreate(@Body() createPlayerDTO: CreatePlayer) {
    return await this.playersService.createUpdatePlayer(createPlayerDTO);
  }

  @Get()
  async findPlayers(@Query('email') email: string): Promise<Player[] | Player> {
    if (email) {
      return await this.playersService.findPlayerEmail(email);
    }
    return await this.playersService.findAllPlayers();
  }

  @Delete()
  async remove(@Query('email') email: string) {
    await this.playersService.removePlayer(email);
  }
}
