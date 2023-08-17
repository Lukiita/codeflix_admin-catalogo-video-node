import { CategorySequelize } from '#category/infra/db/repositories/sequelize/category-sequelize';
import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { setupSequelize } from '#seedwork/infra';
import { DeleteCategoryUseCase } from '../../delete-category.use-case';

describe('DeleteCategoryUseCase Integration Tests', () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategorySequelize.CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelize.CategoryRepository(CategorySequelize.CategoryModel);
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake_id' })).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake_id')
    );
  });

  it('should delete a category', async () => {
    const model = await CategorySequelize.CategoryModel.factory().create();
    let entityFound = await CategorySequelize.CategoryModel.findByPk(model.id);
    expect(entityFound.toJSON()).toStrictEqual(model.toJSON());
    await useCase.execute({ id: model.id });
    entityFound = await CategorySequelize.CategoryModel.findByPk(model.id);
    expect(entityFound).toBeNull();
  });
});