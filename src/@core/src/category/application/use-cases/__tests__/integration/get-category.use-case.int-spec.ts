import { CategorySequelize } from '#category/infra/db/repositories/sequelize/category-sequelize';
import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { setupSequelize } from '#seedwork/infra';
import { GetCategoryUseCase } from '../../get-category.use-case';

const { CategoryModel, CategoryRepository } = CategorySequelize;

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new GetCategoryUseCase.UseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake_id' })).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake_id')
    );
  });

  it('should returns a category', async () => {
    const model = await CategorySequelize.CategoryModel.factory().create();
    const output = await useCase.execute({ id: model.id });
    expect(model.toJSON()).toStrictEqual(output);
  });
});