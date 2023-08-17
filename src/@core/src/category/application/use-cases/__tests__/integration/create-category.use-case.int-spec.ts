import { CategorySequelize } from '#category/infra/db/repositories/sequelize/category-sequelize';
import { setupSequelize } from '#seedwork/infra';
import { CreateCategoryUseCase } from '../../create-category.use-case';

describe('CreateCategoryUseCase Integration Tests', () => {
  let useCase: CreateCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({models: [CategorySequelize.CategoryModel]});

  beforeEach(() => {
    repository = new CategorySequelize.CategoryRepository(CategorySequelize.CategoryModel);
    useCase = new CreateCategoryUseCase.UseCase(repository);
  });

  it('should create a category', async () => {
    let output = await useCase.execute({name: 'test'});
    let entity = await repository.findById(output.id);
    expect(output).toStrictEqual({
      id: entity.id,
      name: 'test',
      description: null,
      is_active: true,
      created_at: entity.created_at
    });
    

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
    });
    entity = await repository.findById(output.id);
    expect(output).toStrictEqual({
      id: entity.id,
      name: 'test',
      description: 'some description',
      is_active: true,
      created_at: entity.created_at
    });

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      is_active: true
    });
    entity = await repository.findById(output.id);
    expect(output).toStrictEqual({
      id: entity.id,
      name: 'test',
      description: 'some description',
      is_active: true,
      created_at: entity.created_at
    });

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      is_active: false
    });
    entity = await repository.findById(output.id);
    expect(output).toStrictEqual({
      id: entity.id,
      name: 'test',
      description: 'some description',
      is_active: false,
      created_at: entity.created_at
    });
  });
});