import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('searchField') searchField = 'name',
    @Query('sortBy') sortBy = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Pagination<Category>> {
    const pageNum: number = Math.max(1, Number(page));
    const limitNum: number = Math.min(100, Number(limit));

    const allowedSearchFields = ['name', 'slug', 'description'] as const;
    const allowedSortFields = ['id', 'name', 'createdAt'] as const;

    const searchFieldSafe: (typeof allowedSearchFields)[number] =
      allowedSearchFields.includes(searchField as any)
        ? (searchField as any)
        : 'name';

    const sortBySafe: (typeof allowedSortFields)[number] =
      allowedSortFields.includes(sortBy as any) ? (sortBy as any) : 'id';

    const sortOrderSafe: 'ASC' | 'DESC' = sortOrder === 'DESC' ? 'DESC' : 'ASC';

    return this.categoriesService.findAll({
      page: pageNum,
      limit: limitNum,
      search,
      searchField: searchFieldSafe,
      sortBy: sortBySafe,
      sortOrder: sortOrderSafe,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
