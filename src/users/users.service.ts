import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

// Interfaz solicitada para paginación y búsqueda en usuarios
export interface UserPaginationOptions extends IPaginationOptions {
  search?: string;
  searchField?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  // Listado con paginación, búsqueda y orden
  async findAll(options: UserPaginationOptions): Promise<Pagination<User>> {
    const {
      search,
      searchField,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = options;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    const allowedSearchFields = ['name', 'email', 'username'] as const;
    const allowedSortFields = ['id', 'name', 'email', 'createdAt'] as const;

    if (
      search &&
      searchField &&
      (allowedSearchFields as readonly string[]).includes(searchField)
    ) {
      queryBuilder.andWhere(`LOWER(user.${searchField}) LIKE :search`, {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const orderField =
      sortBy && (allowedSortFields as readonly string[]).includes(sortBy)
        ? sortBy
        : 'id';
    const orderDirection: 'ASC' | 'DESC' =
      sortOrder === 'DESC' ? 'DESC' : 'ASC';
    queryBuilder.orderBy(`user.${orderField}`, orderDirection);

    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 10, 100);
    return paginate<User>(queryBuilder, { page: pageNum, limit: limitNum });
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }
  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    return this.userRepository.remove(user);
  }
}
