import { Category, CategoryRepository } from '#category/domain';
import { UniqueEntityId } from '#seedwork/domain';
import { CategoryModel } from './category.model';

export class CategorySequelizeRepository implements CategoryRepository.Repository {
  sortableFields: string[] = ['name', 'created_at'];

  constructor(private categoryModel: typeof CategoryModel){}

  public async insert(entity: Category): Promise<void>{
    await this.categoryModel.create(entity.toJSON());
  }
  public async findById(id: string | UniqueEntityId): Promise<Category>{
    return null;
  }
  public async findAll(): Promise<Category[]>{
    return null;
  }
  public async update(entity: Category): Promise<void>{}
  public async delete(id: string | UniqueEntityId): Promise<void>{}

  public async search(props: CategoryRepository.SearchParams): Promise<CategoryRepository.SearchResult>{
    return null;
  }
}