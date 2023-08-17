
import { setupSequelize } from '#seedwork/infra';
import { DataType } from 'sequelize-typescript';
import { CategorySequelize } from './category-sequelize';

describe('CategoryModel Unit Tests', () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] });

  test('mapping props', () => {
    const attributesMap = CategorySequelize.CategoryModel.getAttributes();
    const attributes = Object.keys(attributesMap);
    expect(attributes).toStrictEqual(['id', 'name', 'description', 'is_active', 'created_at']);

    const idAttr = attributesMap.id;
    expect(idAttr).toMatchObject({
      field: 'id',
      fieldName: 'id',
      type: DataType.UUID(),
      primaryKey: true,
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      type: DataType.STRING(255),
      allowNull: false,
    });
    const descriptionAttr = attributesMap.description;
    expect(descriptionAttr).toMatchObject({
      field: 'description',
      fieldName: 'description',
      type: DataType.TEXT(),
      allowNull: true,
    });
    const isActiveAttr = attributesMap.is_active;
    expect(isActiveAttr).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      type: DataType.BOOLEAN(),
      allowNull: false,
    });
    const createdAtAttr = attributesMap.created_at;
    expect(createdAtAttr).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      type: DataType.DATE(),
      allowNull: false,
    });
  });

  it('create', async () => {
    const arrange = {
      id: '48fac1a8-b6c0-40ab-8c58-e737b4635595',
      name: 'test',
      is_active: true,
      created_at: new Date()
    }

    const category = await CategorySequelize.CategoryModel.create(arrange);
    expect(category.toJSON()).toStrictEqual(arrange);
  });
});