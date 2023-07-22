import { Category, CategoryRepository } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { Op } from 'sequelize';
import { CategoryModelMapper } from './category-mapper';
import { CategoryModel } from './category.model';

export class CategorySequelizeRepository implements CategoryRepository.Repository {
  sortableFields: string[] = ['name', 'created_at'];

  constructor(private categoryModel: typeof CategoryModel) { }

  public async insert(entity: Category): Promise<void> {
    await this.categoryModel.create(entity.toJSON());
  }

  public async findById(id: string | UniqueEntityId): Promise<Category> {
    const _id = `${id}`;
    const model = await this._get(_id);
    return CategoryModelMapper.toEntity(model);
  }

  public async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map(m => CategoryModelMapper.toEntity(m));
  }

  public async update(entity: Category): Promise<void> { }
  public async delete(id: string | UniqueEntityId): Promise<void> { }

  public async search(props: CategoryRepository.SearchParams): Promise<CategoryRepository.SearchResult> {
    const offset = (props.page - 1) * props.per_page; // 1 * 15 = 15
    const limit = props.per_page; // 15 + 15 = 30

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: {
            [Op.like]: `%${props.filter}%`
          }
        }
      }),
      ...(props.sort && this.sortableFields.includes(props.sort) ?
        {
          order: [[props.sort, props.sort_dir]]
        } :
        {
          order: [['created_at', 'DESC']]
        }
      ),
      offset,
      limit,
    });
    return new CategoryRepository.SearchResult({
      items: models.map(m => CategoryModelMapper.toEntity(m)),
      current_page: props.page,
      per_page: props.per_page,
      filter: props.filter,
      sort: props.sort,
      sort_dir: props.sort_dir,
      total: count
    });
  }

  private async _get(id: string): Promise<CategoryModel> {
    return await this.categoryModel.findByPk(id, { rejectOnEmpty: new NotFoundError(`Entity Not Found using ID ${id}`) });
  }
}