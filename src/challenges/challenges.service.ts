import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';

import { CreateChallengeDTO, UpdateChallengeDTO } from './dto/challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge')
    private readonly challengeModel: Model<Challenge>,

    private readonly categoriesService: CategoriesService,
    private readonly playerService: PlayersService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  //create Challenge.
  async create(createChallengeDTO: CreateChallengeDTO): Promise<Challenge> {
    const { challenging, players } = createChallengeDTO;

    const verifyChallengerInMatch = players.find(
      (arr) => arr._id === challenging,
    );

    if (!verifyChallengerInMatch) {
      throw new BadRequestException(
        `Player Challenger id: ${challenging} not registerd in match`,
      );
    }

    await Promise.all(
      createChallengeDTO.players.map((_id) =>
        this.playerService.verifyPlayerExist({ _id }),
      ),
    );

    /*
    const challengerCategory = await this.categoriesService.findByIdPlayer(
      createChallengeDTO.challenging,
    );
    */

    const challengerCategory = await this.categoriesService.findByIdPlayer(
      challenging,
    );

    if (!challengerCategory) {
      throw new BadRequestException(
        `Player ${challenging} not found in CATEGORY`,
      );
    }

    console.log(`ChallengerCategory: ${challengerCategory}`);
    const createChallenge = new this.challengeModel(createChallengeDTO);
    createChallenge.category = challengerCategory.category;
    createChallenge.dateTimeRequest = new Date();
    createChallenge.status = ChallengeStatus.PENDING;

    this.logger.log(`createChallenge:  ${JSON.stringify(createChallenge)} `);

    return createChallenge.save();

    //await this.challengeModel.create({ ...createChallengeDTO });
  }

  async update(_id, updateChallengeDTO: UpdateChallengeDTO): Promise<void> {
    const a = 1 + 1;
  }

  async find(): Promise<Challenge[]> {
    return this.challengeModel.find().exec();
  }

  async findById(_id): Promise<Challenge> {
    return this.challengeModel.findOne({ _id }).exec();
  }

  async remove(_id): Promise<void> {
    await this.challengeModel.deleteOne(_id).exec();
  }
}
