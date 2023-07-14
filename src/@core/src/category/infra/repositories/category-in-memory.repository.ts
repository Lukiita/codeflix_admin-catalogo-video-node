import { InMemorySearchableRepository } from '#seedwork/domain/repositories/in-memory.repository';
import { SortDirection } from '#seedwork/domain/repositories/repository-contracts';
import { Category } from '../../domain/entities/category';
import CategoryRepository from '../../domain/repositories/category.repository';

export class CategoryInMemoryRepository extends InMemorySearchableRepository<Category> implements CategoryRepository.Repository {
  sortableFields: string[] = ['name', 'created_at'];

  protected async applyFilter(items: Category[], filter: CategoryRepository.Filter): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter(item => item.props.name.toLowerCase().includes(filter.toLowerCase()));
  }

  protected applySort(items: Category[], sort: string, sort_dir: SortDirection): Promise<Category[]> {
    return !sort ?
      super.applySort(items, 'created_at', 'desc') :
      super.applySort(items, sort, sort_dir);
  }
}

export default CategoryInMemoryRepository;