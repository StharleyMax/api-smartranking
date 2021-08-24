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
import { CreateChallengeDTO, UpdateChallengeDTO } from './dto/challenge.dto';
import { Challenge } from './interfaces/challenge.interface';

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

  @Put('/:_id')
  async update(
    @Param('_id') _id: string,
    updateChallengeDTO: UpdateChallengeDTO,
  ): Promise<void> {
    await this.challengeService.update(_id, updateChallengeDTO);
  }

  @Delete('_id')
  async remove(@Param('_id') _id: string): Promise<void> {
    await this.challengeService.remove(_id);
  }

  @Get()
  async find(): Promise<Challenge[]> {
    return this.challengeService.find();
  }

  @Get('_id')
  async findById(@Param('_id') _id: string): Promise<Challenge> {
    return this.challengeService.findById(_id);
  }
}
