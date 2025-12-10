import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryPaginationOptions } from './dto/pagination-options.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(
    options: CategoryPaginationOptions,
  ): Promise<Pagination<Category>> {
    const {
      search,
      searchField,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = options;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    // Campos permitidos para búsqueda y ordenamiento (evitar SQL injection)
    const allowedSearchFields = ['name', 'slug', 'description'] as const;
    const allowedSortFields = ['id', 'name', 'createdAt'] as const;

    if (
      search &&
      searchField &&
      (allowedSearchFields as readonly string[]).includes(searchField)
    ) {
      queryBuilder.andWhere(`LOWER(category.${searchField}) LIKE :search`, {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const orderField =
      sortBy && (allowedSortFields as readonly string[]).includes(sortBy)
        ? sortBy
        : 'id';
    const orderDirection: 'ASC' | 'DESC' =
      sortOrder === 'DESC' ? 'DESC' : 'ASC';
    queryBuilder.orderBy(`category.${orderField}`, orderDirection);

    return paginate<Category>(queryBuilder, { page, limit });
  }

  findOne(id: string) {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) return null;
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) return null;
    return this.categoryRepository.remove(category);
  }
}
