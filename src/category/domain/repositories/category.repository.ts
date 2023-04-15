import { ISearchableRepository } from '@seedwork/domain/repositories/repository-contracts';
import { Category } from '../entities/category';

export default interface CategoryRepository extends ISearchableRepository<Category, any, any> {}