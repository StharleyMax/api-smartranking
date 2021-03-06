import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import {
  AddMatchChallengeDTO,
  CreateChallengeDTO,
  UpdateChallengeDTO,
} from './dto/challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipe/challenges-status-validation.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengeService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createChallengeDTO: CreateChallengeDTO,
  ): Promise<Challenge> {
    return this.challengeService.create(createChallengeDTO);
  }

  @Post('match/:challenge/')
  async addMatchChallenge(
    @Body(ValidationPipe) addMatchChallengeDTO: AddMatchChallengeDTO,
    @Param('challenge') idChallenge: string,
  ): Promise<void> {
    return this.challengeService.addMatchChallenge(
      idChallenge,
      addMatchChallengeDTO,
    );
  }

  @Put('/:_idChallenge')
  async update(
    @Param('_idChallenge') _idChallenge: string,
    @Body(ChallengeStatusValidationPipe) updateChallengeDTO: UpdateChallengeDTO,
  ): Promise<void> {
    await this.challengeService.update(_idChallenge, updateChallengeDTO);
  }

  @Delete('_id')
  async remove(@Param('_id') _id: string): Promise<void> {
    await this.challengeService.remove(_id);
  }

  @Get()
  async find(): Promise<Challenge[]> {
    return this.challengeService.find();
  }

  @Get('/:_id')
  async findById(@Param('_id') _id: string): Promise<Challenge[]> {
    return this.challengeService.findById(_id);
  }
}
