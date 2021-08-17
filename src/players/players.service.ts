import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayer } from './dto/players.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class PlayersService {
  private players: Player[] = [];
  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDTO: CreatePlayer): Promise<void> {
    const { email } = createPlayerDTO;

    const existPlayer = this.players.find((player) => player.email === email);
    if (existPlayer) {
      return this.updatePlayer(existPlayer, createPlayerDTO);
    }

    return this.create(createPlayerDTO);
  }

  private create(createPlayerDTO: CreatePlayer): void {
    const { name, cellPhone, email } = createPlayerDTO;

    const player: Player = {
      _id: uuidv4(),
      name,
      email,
      cellPhone,
      ranking: 'A',
      positionRanking: 1,
      ulrPhotoPlayer: 'www.seiLa.com',
    };
    this.logger.log(`createPlayerDTO: ${JSON.stringify(player)}`);

    this.players.push(player);
  }

  private updatePlayer(player: Player, createPlayerDTO: CreatePlayer): void {
    const { name } = createPlayerDTO;

    player.name = name;
  }

  async findAllPlayers(): Promise<Player[]> {
    return this.players;
  }

  async findPlayerEmail(email): Promise<Player> {
    const existPlayer = this.players.find((player) => player.email === email);

    if (!existPlayer) {
      throw new NotFoundException('email not found');
    }

    return existPlayer;
  }

  async removePlayer(email: string) {
    const existPlayer = this.players.find((player) => player.email === email);

    if (!existPlayer) {
      throw new NotFoundException('email not found');
    }

    return this.players.splice(this.players.indexOf(existPlayer), 1);
  }
}
