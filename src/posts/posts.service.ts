import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Category } from '../categories/category.entity';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

// Interface solicitada: definir en el servicio
export interface PostPaginationOptions extends IPaginationOptions {
  search?: string;
  searchField?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const category = await this.categoryRepository.findOne({
      where: { id: createPostDto.categoryId },
    });
    if (!category) throw new NotFoundException('Categoría no encontrada');

    const post = this.postRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      category,
    });
    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find({ relations: ['category'] });
  }

  // Nueva versión paginada con búsqueda y orden
  async findAllPaginated(
    options: PostPaginationOptions,
  ): Promise<Pagination<Post>> {
    const {
      page = 1,
      limit = 10,
      search,
      searchField,
      sortBy,
      sortOrder,
    } = options;

    // Campos permitidos para evitar inyección
    const allowedSearchFields = ['title', 'content'] as const;
    const allowedSortFields = ['id', 'title'] as const;

    const safeSearchField = allowedSearchFields.includes(searchField as any)
      ? (searchField as (typeof allowedSearchFields)[number])
      : undefined;

    const safeSortBy = allowedSortFields.includes(sortBy as any)
      ? (sortBy as (typeof allowedSortFields)[number])
      : 'id';

    const safeSortOrder = sortOrder === 'DESC' ? 'DESC' : 'ASC';

    const qb = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category');

    if (search && safeSearchField) {
      qb.andWhere(`LOWER(post.${safeSearchField}) LIKE :term`, {
        term: `%${search.toLowerCase()}%`,
      });
    }

    qb.orderBy(`post.${safeSortBy}`, safeSortOrder);

    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 10, 100);

    return paginate<Post>(qb, { page: pageNum, limit: limitNum });
  }

  findOne(id: string) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!post) throw new NotFoundException('Post no encontrado');

    if (updatePostDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updatePostDto.categoryId },
      });
      if (!category) throw new NotFoundException('Categoría no encontrada');
      post.category = category;
    }

    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }

  async remove(id: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post no encontrado');
    return this.postRepository.remove(post);
  }
}
