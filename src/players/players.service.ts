import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { CreatePlayer } from './dto/players.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('player') private readonly playerModel: Model<Player>,
  ) {}

  //  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDTO: CreatePlayer): Promise<Player> {
    const { email } = createPlayerDTO;

    const existPlayer = await this.findPlayerEmail(email);
    if (existPlayer) {
      return this.updatePlayer(createPlayerDTO);
    }

    return this.create(createPlayerDTO);
  }

  async create(createPlayerDTO: CreatePlayer): Promise<Player> {
    const player = new this.playerModel(createPlayerDTO);

    return player.save();

    /*
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
    */
  }

  async updatePlayer(createPlayerDTO: CreatePlayer): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate(
        { email: createPlayerDTO.email },
        { $set: createPlayerDTO },
      )
      .exec();
  }

  async findAllPlayers(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  async findPlayerEmail(email): Promise<Player> {
    //const existPlayer = this.players.find((player) => player.email === email);

    const existPlayer = await this.playerModel.findOne({ email }).exec();

    return existPlayer;
  }

  async removePlayer(email: string): Promise<any> {
    const existPlayer = this.findPlayerEmail(email);

    if (!existPlayer) {
      throw new NotFoundException('email not found');
    }

    return this.playerModel.remove({email}).exec();
  }
}
