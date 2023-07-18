import { CreateCategoryUseCase, ListCategoriesUseCase, UpdateCategoryUseCase } from 'codeflix/category/application';
import { CategoriesController } from './categories.controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should creates a category', async () => {
    const expectedOutput: CreateCategoryUseCase.Output = {
      id: '5e590ba1-9fc4-452d-a72f-993271eb63c4',
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date()
    }
    const mockCreateUseCase: any = {
      execute: jest.fn().mockResolvedValue(expectedOutput)
    }
    controller['createUseCase'] = mockCreateUseCase;

    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true
    };
    const output = await controller.create(input);
    expect(mockCreateUseCase.execute).toBeCalledWith(input);
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should updates a category', async () => {
    const expectedOutput: UpdateCategoryUseCase.Output = {
      id: '5e590ba1-9fc4-452d-a72f-993271eb63c4',
      name: 'Movie 2',
      description: 'some description',
      is_active: true,
      created_at: new Date()
    }
    const mockUpdateUseCase: any = {
      execute: jest.fn().mockResolvedValue(expectedOutput)
    }
    controller['updateUseCase'] = mockUpdateUseCase;

    const input: UpdateCategoryDto = {
      name: 'Movie 2',
      description: 'some description',
      is_active: true
    };
    const output = await controller.update(expectedOutput.id, input);
    expect(mockUpdateUseCase.execute).toBeCalledWith({ id: expectedOutput.id, ...input });
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should gets a category', async () => {
    const id = '5e590ba1-9fc4-452d-a72f-993271eb63c4';
    const expectedOutput: UpdateCategoryUseCase.Output = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date()
    }
    const mockGetUseCase: any = {
      execute: jest.fn().mockResolvedValue(expectedOutput)
    }
    controller['getUseCase'] = mockGetUseCase;

    const output = await controller.findOne(id);
    expect(mockGetUseCase.execute).toBeCalledWith({ id });
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should list categories', async () => {
    const id = '5e590ba1-9fc4-452d-a72f-993271eb63c4';
    const expectedOutput: ListCategoriesUseCase.Output = {
      items: [
        {
          id,
          name: 'Movie',
          description: 'some description',
          is_active: true,
          created_at: new Date()
        }
      ],
      current_page: 1,
      last_age: 1,
      per_page: 1,
      total: 1,
    }
    const mockListUseCase: any = {
      execute: jest.fn().mockResolvedValue(expectedOutput)
    }
    controller['listUseCase'] = mockListUseCase;
    const searchParams: ListCategoriesUseCase.Input = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'test'
    }
    const output = await controller.search(searchParams);
    expect(mockListUseCase.execute).toBeCalledWith(searchParams);
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should deletes a category', async () => {
    const id = '5e590ba1-9fc4-452d-a72f-993271eb63c4';
    const mockDeleteUseCase: any = {
      execute: jest.fn().mockResolvedValue(undefined)
    }
    controller['deleteUseCase'] = mockDeleteUseCase;
    expect(controller.remove(id)).toBeInstanceOf(Promise);

    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toBeCalledWith({ id });
    expect(output).toBeUndefined();
  });

});
