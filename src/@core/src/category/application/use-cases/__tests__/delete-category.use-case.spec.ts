import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { Category } from '../../../../category/domain/entities/category';
import CategoryInMemoryRepository from '../../../infra/repositories/category-in-memory.repository';
import { DeleteCategoryUseCase } from '../delete-category.use-case';

describe('DeleteCategoryUseCase Unit Tests', () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it('should throws error when entity not found', () => {
    expect(() => useCase.execute({ id: 'fake_id'})).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake_id')
    );
  });

  it('should delete a category', async () => {
    const spyDelete = jest.spyOn(repository, 'delete');
    const entity = new Category({ name: 'Movie' });
    const entity2 = new Category({ name: 'Cartoon' });
    repository.items = [entity, entity2];
    await useCase.execute({ id: entity.id });
    expect(spyDelete).toBeCalledTimes(1);
    expect(repository.items).toHaveLength(1);

    await useCase.execute({ id: entity2.id });
    expect(repository.items).toHaveLength(0);
  });
});