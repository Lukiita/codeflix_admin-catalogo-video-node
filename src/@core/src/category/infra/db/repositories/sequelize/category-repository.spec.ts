import { Category } from '#category/domain';
import { Sequelize } from 'sequelize-typescript';
import { CategorySequelizeRepository } from './category-repository';
import { CategoryModel } from './category.model';

describe('CategorySequelizeRepository E2E Tests', () => {
  let sequelize: Sequelize;
  let repository: CategorySequelizeRepository;

  beforeAll(() =>
    sequelize = new Sequelize({
      dialect: 'sqlite',
      host: ':memory:',
      logging: false,
      models: [CategoryModel]
    })
  );

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
    await sequelize.sync({force: true});
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should inserts a new entity', async () => {
    const category = new Category({name: 'Movie'});
    await repository.insert(category);
    const model = await CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());

    const category2 = new Category({
      name: 'Movie',
      description: 'some description',
      is_active: false
    });
    await repository.insert(category2);
    const model2 = await CategoryModel.findByPk(category2.id);
    expect(model2.toJSON()).toStrictEqual(category2.toJSON());
  });
});