import { Category, CategoryRepository } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra';
import _chance from 'chance';
import { CategoryModelMapper } from './category-mapper';
import { CategorySequelizeRepository } from './category-repository';
import { CategoryModel } from './category.model';
describe('CategorySequelizeRepository E2E Tests', () => {
  let chance: Chance.Chance;

  setupSequelize({ models: [CategoryModel] });
  let repository: CategorySequelizeRepository;

  beforeAll(() => chance = new _chance());

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
    it('should only apply paginate when other params are null', async () => {
      const created_at = new Date();
      await CategoryModel.factory().count(16).bulkCreate(() => ({
        id: chance.guid({ version: 4 }),
        name: 'Movie',
        description: null,
        is_active: true,
        created_at,
      }));
      const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity');
      const searchOutput = await repository.search(new CategoryRepository.SearchParams());
      expect(searchOutput).toBeInstanceOf(CategoryRepository.SearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null
      });

      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(Category);
        expect(item.id).toBeDefined();
      });

      const items = searchOutput.items.map(item => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Movie',
          description: null,
          is_active: true,
          created_at,
        })
      );
    });

    it('should order by created_at DESC when search params are null', async () => {
      const createdAt = new Date();
      await CategoryModel
        .factory()
        .count(16)
        .bulkCreate((index) => ({
          id: chance.guid({ version: 4 }),
          name: `Movie${index}`,
          description: null,
          is_active: true,
          created_at: new Date(createdAt.getTime() + 100 + index),
        }));
      const searchOutput = await repository.search(new CategoryRepository.SearchParams());
      searchOutput.items
        .reverse()
        .forEach((item, index) => {
          expect(item.name).toBe(`Movie${index + 1}`);
        });
    });

    it('should apply paginate and filter', async () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      }

      const categoriesProp = [
        { id: chance.guid({ version: 4 }), name: 'name value', price: 5, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'test', price: 10, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TEST', price: 15, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'a', price: 0, ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TeSt', price: 5, ...defaultProps },
      ];
      const categories = await CategoryModel.bulkCreate(categoriesProp);

      let searchOutput = await repository.search(
        new CategoryRepository.SearchParams({ page: 1, per_page: 2, filter: 'TEST' })
      );
      expect(searchOutput.toJSON(true)).toStrictEqual(
        new CategoryRepository.SearchResult({
          items: [
            CategoryModelMapper.toEntity(categories[1]),
            CategoryModelMapper.toEntity(categories[2]),
          ],
          total: 3,
          current_page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: 'TEST',
        }).toJSON(true)
      );

      searchOutput = await repository.search(
        new CategoryRepository.SearchParams({ page: 2, per_page: 2, filter: 'TEST' })
      );
      expect(searchOutput.toJSON(true)).toStrictEqual(
        new CategoryRepository.SearchResult({
          items: [
            CategoryModelMapper.toEntity(categories[4]),
          ],
          total: 3,
          current_page: 2,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: 'TEST',
        }).toJSON(true)
      );
    });
  });

});