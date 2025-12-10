import { IPaginationOptions } from 'nestjs-typeorm-paginate';

export interface CategoryPaginationOptions extends IPaginationOptions {
  search?: string;
  searchField?: 'name' | 'slug' | 'description';
  sortBy?: 'id' | 'name' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}
