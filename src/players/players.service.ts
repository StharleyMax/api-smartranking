import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreatePlayerDTO, UpdatePlayerDTO } from './dto/players.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  //  private readonly logger = new Logger(PlayersService.name);

  //create player
  async create(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDTO;

    const existPlayer = await this.playerModel.findOne({ email }).exec();
    if (existPlayer) {
      throw new BadRequestException('E-mail already registered');
    }

    const player = new this.playerModel(createPlayerDTO);
    return player.save();
  }

  //update player
  async update(_id: string, updatePlayerDTO: UpdatePlayerDTO): Promise<Player> {
    const { email } = updatePlayerDTO;

    const existPlayerId = await this.playerModel.findOne({ _id }).exec();
    if (!existPlayerId) {
      throw new NotFoundException('Player not found');
    }

    const checkEmail = await this.playerModel.findOne({ email }).exec();
    if (checkEmail) {
      throw new BadRequestException('E-mail already registered');
    }

    return await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDTO })
      .exec();
  }

  //findAll
  async find(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  //findById
  async findById(_id: string): Promise<Player> {
    const existPlayer = await this.playerModel.findOne({ _id }).exec();

    if (!existPlayer) {
      throw new NotFoundException('ID Player not found');
    }

    return existPlayer;
  }

  //Delete Player
  async remove(_id: string): Promise<any> {
    const existPlayer = await this.playerModel.findOne({ _id }).exec();

    if (!existPlayer) {
      throw new NotFoundException('Player not found');
    }

    return this.playerModel.deleteOne({ _id }).exec();
  }
}
