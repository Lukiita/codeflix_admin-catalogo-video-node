import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { Category } from '../../../domain/entities/category';
import CategoryInMemoryRepository from '../../../infra/repositories/category-in-memory.repository';
import { GetCategoryUseCase } from '../get-category.use-case';

describe('GetCategoryUseCase Unit Tests', () => {
  let useCase: GetCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase.UseCase(repository);
  });

  it('should throws error when entity not found', () => {
    expect(() => useCase.execute({ id: 'fake_id' })).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake_id')
    );
  });

  it('should returns a category', async () => {
    const items = [
      new Category({ name: 'Category' })
    ];
    repository.items = items;

    const spyFindById = jest.spyOn(repository, 'findById');
    const output = await useCase.execute({ id: repository.items[0].id });
    expect(output).toStrictEqual({
      id: items[0].id,
      name: 'Category',
      description: null,
      is_active: true,
      created_at: items[0].created_at
    });
    expect(spyFindById).toBeCalledTimes(1);
    expect(spyFindById).toBeCalledWith(items[0].id);
  });
});