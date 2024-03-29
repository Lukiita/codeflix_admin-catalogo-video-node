import { Category } from '#category/domain';
import { LoadEntityError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra';
import { CategorySequelize } from './category-sequelize';

describe('CategoryModelMaper Unit Tests', () => {
  setupSequelize({models: [ CategorySequelize.CategoryModel]});

  it('should throws error when category is invalid', () => {
    const model = CategorySequelize.CategoryModel.build({ id: '48fac1a8-b6c0-40ab-8c58-e737b4635595' });
    try {
      CategorySequelize.CategoryModelMapper.toEntity(model);
      fail('The category is valid, but must throws a LoadEntityError');
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect(e.error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it('should throws a generic error', () => {
    const error = new Error('Generic error');
    const spyValidate = jest
      .spyOn(Category, 'validate')
      .mockImplementation(() => {
        throw error;
      });
    const model = CategorySequelize.CategoryModel.build({ id: '48fac1a8-b6c0-40ab-8c58-e737b4635595' });
    expect(() => CategorySequelize.CategoryModelMapper.toEntity(model)).toThrow(error);
    expect(spyValidate).toBeCalled();
    spyValidate.mockRestore();
  });

  it('should convert a category model to a category entity', () => {
    const created_at = new Date();
    const model = CategorySequelize.CategoryModel.build({
      id: '48fac1a8-b6c0-40ab-8c58-e737b4635595',
      name: 'some value',
      description: 'some description',
      is_active: true,
      created_at,
    });
    const entity = CategorySequelize.CategoryModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual(
      new Category(
        {
          name: 'some value',
          description: 'some description',
          is_active: true,
          created_at
        },
        new UniqueEntityId('48fac1a8-b6c0-40ab-8c58-e737b4635595')
      ).toJSON()
    );
  });
});