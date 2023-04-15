import { InMemorySearchableRepository } from '@seedwork/domain/repositories/in-memory.repository';
import { Category } from 'category/domain/entities/category';
import CategoryRepository from 'category/domain/repositories/category.repository';

export default class CategoryInMemoryRepository extends InMemorySearchableRepository<Category> implements CategoryRepository {
  
}