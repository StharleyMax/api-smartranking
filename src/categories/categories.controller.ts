import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { Category } from './interfaces/category.interface';

import { CreateCategoriesDTO, UpdateCategoriesDTO } from './dto/catagories.dto';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createCategoriesDTO: CreateCategoriesDTO,
  ): Promise<Category> {
    return await this.categoryService.create(createCategoriesDTO);
  }

  @Get()
  async find(): Promise<Category[]> {
    return this.categoryService.find();
  }

  @Get(':category')
  async findById(@Param('category') category: string): Promise<Category> {
    return this.categoryService.findById(category);
  }

  @Put('/:category')
  @UsePipes(ValidationPipe)
  async update(
    @Param('category') category: string,
    @Body() updateCategoriesDTO: UpdateCategoriesDTO,
  ): Promise<void> {
    this.categoryService.update(category, updateCategoriesDTO);
  }

  @Post('/:category/player/:idPlayer')
  async addCategoryPlayer(@Param() params: string[]): Promise<void> {
    return this.categoryService.addCategoryPlayer(params);
  }
}
