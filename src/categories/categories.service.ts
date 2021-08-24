import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';

import { CreateCategoriesDTO, UpdateCategoriesDTO } from './dto/catagories.dto';

import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,

    private readonly playersService: PlayersService,
  ) {}

  //Create Category
  async create(createCategoryDTO: CreateCategoriesDTO): Promise<Category> {
    const { category } = createCategoryDTO;

    const existCategory = await this.categoryModel.findOne({ category }).exec();

    if (existCategory) {
      throw new BadRequestException('Category alread exist');
    }

    const createCategory = new this.categoryModel(createCategoryDTO);
    return await createCategory.save();
  }

  //find
  async find(): Promise<Category[]> {
    return this.categoryModel.find().populate('players').exec();
  }

  //Find by id
  async findById(category: string): Promise<Category> {
    const existCategory = await this.categoryModel.findOne({ category }).exec();

    if (!existCategory) {
      throw new BadRequestException('_ID not found');
    }

    return existCategory;
  }

  //Find Category by Id_player
  async findByIdPlayer(_idPlayer): Promise<Category> {
    /*const player = await this.categoryModel
      .findOne({ _idPlayer })
      .where('_id')
      .in(_idPlayer);

    console.log(`Player pela Categoria: ${player}`);*/

    const players = await this.playersService.find();
    console.log(players, _idPlayer);

    const playerFilter = players.filter((player) => player._id == _idPlayer);
    if (playerFilter.length == 0) {
      throw new BadRequestException(`Player ${_idPlayer} not found`);
    }

    return this.categoryModel.findOne().where('players').in(_idPlayer).exec();
  }

  //update
  async update(
    category: string,
    updateCategoriesDTO: UpdateCategoriesDTO,
  ): Promise<void> {
    const existCategory = this.categoryModel.findOne({ category }).exec();

    if (!existCategory) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: updateCategoriesDTO })
      .exec();
  }

  // Add player to category
  async addCategoryPlayer(params: string[]): Promise<void> {
    const category = params['category'];
    const idPlayer = params['idPlayer'];

    const existCategory = await this.categoryModel.findOne({ category }).exec();
    const playerAlreadyAdd = await this.categoryModel
      .find({ category })
      .where('players')
      .in(idPlayer)
      .exec();

    if (!existCategory) {
      throw new NotFoundException('Category not found');
    }

    if (playerAlreadyAdd.length > 0) {
      throw new BadRequestException(
        `Player ${idPlayer} already exist in category ${category}`,
      );
    }

    await this.playersService.findById(idPlayer);

    console.log(category, idPlayer);
    existCategory.players.push(idPlayer);

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: existCategory })
      .exec();
  }
}
