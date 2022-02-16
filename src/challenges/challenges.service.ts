import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';

import {
  AddMatchChallengeDTO,
  CreateChallengeDTO,
  UpdateChallengeDTO,
} from './dto/challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge, Match } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge')
    private readonly challengeModel: Model<Challenge>,

    @InjectModel('Match')
    private readonly matchModel: Model<Match>,

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
    const challengeExist = await this.challengeModel.findById(_id);

    if (!challengeExist) {
      throw new BadRequestException(`Challenge ID: ${_id} not found`);
    }

    if (updateChallengeDTO.status) {
      challengeExist.dateTimeResponse = new Date();
      challengeExist.status = updateChallengeDTO.status;
    }

    challengeExist.dateTime = updateChallengeDTO.dateTime;

    console.log(`Challenge Exist> ${challengeExist}`);

    await this.challengeModel.findOneAndUpdate(
      { _id },
      { $set: challengeExist },
    );
  }

  async addMatchChallenge(
    idChallenge,
    addMatchChallengeDTO: AddMatchChallengeDTO,
  ) {
    const { def } = addMatchChallengeDTO;
    const challengeExist = await this.challengeModel
      .findById(idChallenge)
      .exec();

    if (!challengeExist) {
      throw new BadRequestException(`Challenge ID: ${idChallenge} not found`);
    }

    //const verifyPlayerExist = await this.playerService.verifyPlayerExist({
    //  def,
    //});

    const createMatch = new this.matchModel(addMatchChallengeDTO);
    createMatch.category = challengeExist.category;
    createMatch.players = challengeExist.players;

    const result = await createMatch.save();

    challengeExist.status = ChallengeStatus.DONE;
    challengeExist.match = result._id;

    try {
      await this.challengeModel
        .findOneAndUpdate({ idChallenge }, { $set: { challengeExist } })
        .exec();
    } catch (err) {
      await this.challengeModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async find(): Promise<Challenge[]> {
    return this.challengeModel
      .find()
      .populate('challenging')
      .populate('players')
      .populate('match')
      .exec();
  }

  async findById(_id): Promise<Challenge[]> {
    await this.playerService.findById(_id);

    return this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('challenging')
      .populate('players')
      .populate('match')
      .exec();
  }

  async remove(_id: string): Promise<void> {
    const challengeExist = await this.challengeModel.findById(_id).exec();

    if (!challengeExist) {
      throw new BadRequestException(`Challenge id: ${_id} not found`);
    }

    challengeExist.status = ChallengeStatus.CANCELED;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challengeExist })
      .exec();
  }
}
