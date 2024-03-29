import { CategorySequelize } from '#category/infra/db/repositories/sequelize/category-sequelize';
import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { setupSequelize } from '#seedwork/infra';
import { UpdateCategoryUseCase } from '../../update-category.use-case';

describe('UpdateCategoryUseCase Integration Tests', () => {
  let useCase: UpdateCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategorySequelize.CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelize.CategoryRepository(CategorySequelize.CategoryModel);
    useCase = new UpdateCategoryUseCase.UseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake_id', name: 'fake' })).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake_id')
    );
  });

  it('should update a category', async () => {
    const model = await CategorySequelize.CategoryModel.factory().create();

    let output = await useCase.execute({ id: model.id, name: 'test' });
    expect(output).toStrictEqual({
      id: model.id,
      name: 'test',
      description: null,
      is_active: model.is_active,
      created_at: model.created_at
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: null | string;
        is_active?: boolean;
      };
      expected: {
        id: string;
        name: string;
        description: null | string;
        is_active: boolean;
        created_at: Date;
      }
    }

    const arrange: Arrange[] = [
      {
        input: {
          id: model.id,
          name: 'test',
          description: 'some description'
        },
        expected: {
          id: model.id,
          name: 'test',
          description: 'some description',
          is_active: model.is_active,
          created_at: model.created_at
        }
      },
      {
        input: {
          id: model.id,
          name: 'test'
        },
        expected: {
          id: model.id,
          name: 'test',
          description: null,
          is_active: model.is_active,
          created_at: model.created_at
        }
      },
       {
        input: {
          id: model.id,
          name: 'test',
          is_active: false
        },
        expected: {
          id: model.id,
          name: 'test',
          description: null,
          is_active: false,
          created_at: model.created_at
        }
      },
      {
        input: {
          id: model.id,
          name: 'test'
        },
        expected: {
          id: model.id,
          name: 'test',
          description: null,
          is_active: false,
          created_at: model.created_at
        }
      },
      {
        input: {
          id: model.id,
          name: 'test',
          is_active: true
        },
        expected: {
          id: model.id,
          name: 'test',
          description: null,
          is_active: true,
          created_at: model.created_at
        }
      },
      {
        input: {
          id: model.id,
          name: 'test',
          description: 'some description',
          is_active: false
        },
        expected: {
          id: model.id,
          name: 'test',
          description: 'some description',
          is_active: false,
          created_at: model.created_at
        }
      }
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        name: i.input.name,
        description: i.input.description,
        is_active: i.input.is_active
      });
      expect(output).toStrictEqual({
        id: i.expected.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at
      });
    }
  });
});