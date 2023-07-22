import { Category } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra';
import { CategorySequelizeRepository } from './category-repository';
import { CategoryModel } from './category.model';

describe('CategorySequelizeRepository E2E Tests', () => {
  setupSequelize({models: [ CategoryModel]});
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  describe('create method', () => {
    it('should inserts a new entity', async () => {
      const category = new Category({ name: 'Movie' });
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

  describe('findById method', () => {
    it('should throw error when entity not found', async () => {
      const uuid = '48fac1a8-b6c0-40ab-8c58-e737b4635595';
      await expect(repository.findById('fake id')).rejects.toThrow(
        new NotFoundError(`Entity Not Found using ID fake id`)
      );

      await expect(
        repository.findById(new UniqueEntityId(uuid))
      ).rejects.toThrow(
        new NotFoundError(`Entity Not Found using ID ${uuid}`)
      );
    });

    it('should finds entity by id', async () => {
      const entity = new Category({ name: 'Movie' });
      await repository.insert(entity);

      let entityFound = await repository.findById(entity.id);
      expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

      entityFound = await repository.findById(entity.uniqueEntityId);
      expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
    });
  });

  describe('findAll method', () => {
    it('should return all categories', async () => {
      const entity = new Category({ name: 'Movie' });
      await repository.insert(entity);
      const entities = await repository.findAll();
      expect(entities).toHaveLength(1);
      expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
    });
  });

  describe('search method', () => { 
    it('', async () => {
      await CategoryModel.factory().create();
      console.log(await CategoryModel.findAll());
    });
   })

});