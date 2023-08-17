import { CategorySequelize } from '#category/infra/db/repositories/sequelize/category-sequelize';
import { setupSequelize } from '#seedwork/infra';
import _chance from 'chance';
import { ListCategoriesUseCase } from '../../list-categories.use-case';

describe('ListCategoriesUseCase Integration Tests', () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategorySequelize.CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelize.CategoryRepository(CategorySequelize.CategoryModel);
    useCase = new ListCategoriesUseCase.UseCase(repository);
  });

  it('should returns a output using empty input with categories ordered by created_at', async () => {
    const models = await CategorySequelize.CategoryModel.factory().count(2).bulkCreate((index) => {
      const chance = new _chance();
      return {
        id: chance.guid({ version: 4 }),
        name: `Category ${index}`,
        description: `Some description`,
        is_active: true,
        created_at: new Date(new Date().getTime() + index),
      }
    });

    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [...models].reverse()
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map(category => category.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should returns output using pagination, sort and filter', async () => {
    const models = await CategorySequelize.CategoryModel.factory().count(5).bulkMake();
    models[0].name = 'a';
    models[1].name = 'AAA';
    models[2].name = 'AaA';
    models[3].name = 'b';
    models[4].name = 'c';
    await CategorySequelize.CategoryModel.bulkCreate(models.map(m => m.toJSON()));

    let output = await useCase.execute({ page: 1, per_page: 2, sort: 'name', filter: 'a' });
    expect(output).toStrictEqual({
      items: [models[1], models[2]]
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map(category => category.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({ page: 2, per_page: 2, sort: 'name', filter: 'a' });
    expect(output).toStrictEqual({
      items: [models[0]]
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map(category => category.toJSON()),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({ page: 1, per_page: 2, sort: 'name', sort_dir: 'desc', filter: 'a' });
    expect(output).toStrictEqual({
      items: [models[0], models[2]]
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map(category => category.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});