import { Category, CategoryRepository } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra';
import _chance from 'chance';
import { CategorySequelize } from './category-sequelize';

const chance = new _chance();
describe('CategorySequelizeRepository E2E Tests', () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] });
  let repository: CategorySequelize.CategorySequelizeRepository;

  beforeEach(async () => {
    repository = new CategorySequelize.CategorySequelizeRepository(CategorySequelize.CategoryModel);
  });

  describe('create method', () => {
    it('should inserts a new entity', async () => {
      const category = new Category({ name: 'Movie' });
      await repository.insert(category);
      const model = await CategorySequelize.CategoryModel.findByPk(category.id);
      expect(model.toJSON()).toStrictEqual(category.toJSON());

      const category2 = new Category({
        name: 'Movie',
        description: 'some description',
        is_active: false
      });
      await repository.insert(category2);
      const model2 = await CategorySequelize.CategoryModel.findByPk(category2.id);
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

  describe('update method', () => {
    it('should throw error on update when entity not found', async () => {
      const entity = new Category({ name: 'Movie' });
      await expect(repository.update(entity)).rejects.toThrow(
        new NotFoundError(`Entity Not Found using ID ${entity.id}`)
      );
    });

    it('should throw error on update when entity not found', async () => {
      const entity = new Category({ name: 'Movie' });
      await repository.insert(entity);

      entity.update('Cartoon', 'Some description');
      await repository.update(entity);
      const entityUpdated = await repository.findById(entity.id);

      expect(entityUpdated).toMatchObject({
        name: 'Cartoon',
        description: 'Some description'
      });
    });
  });

  describe('delete method', () => {
    it('should throw error on delete when entity not found', async () => {
      const entity = new Category({ name: 'Movie' });
      await expect(repository.delete(entity.id)).rejects.toThrow(
        new NotFoundError(`Entity Not Found using ID ${entity.id}`)
      );
    });

    it('should throw error on update when entity not found', async () => {
      const entity = new Category({ name: 'Movie' });
      await repository.insert(entity);

      await repository.delete(entity.id);
      const entityFound = await CategorySequelize.CategoryModel.findByPk(entity.id);

      expect(entityFound).toBeNull();
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
      await CategorySequelize.CategoryModel.factory().count(16).bulkCreate(() => ({
        id: chance.guid({ version: 4 }),
        name: 'Movie',
        description: null,
        is_active: true,
        created_at,
      }));
      const spyToEntity = jest.spyOn(CategorySequelize.CategoryModelMapper, 'toEntity');
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
      await CategorySequelize.CategoryModel
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
        { id: chance.guid({ version: 4 }), name: 'name value', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'test', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TEST', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TeSt', ...defaultProps },
      ];
      const categories = await CategorySequelize.CategoryModel.bulkCreate(categoriesProp);

      let searchOutput = await repository.search(
        new CategoryRepository.SearchParams({ page: 1, per_page: 2, filter: 'TEST' })
      );
      expect(searchOutput.toJSON(true)).toStrictEqual(
        new CategoryRepository.SearchResult({
          items: [
            CategorySequelize.CategoryModelMapper.toEntity(categories[1]),
            CategorySequelize.CategoryModelMapper.toEntity(categories[2]),
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
            CategorySequelize.CategoryModelMapper.toEntity(categories[4]),
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

    it('should apply paginate and sort', async () => {
      const created_at = new Date();
      expect(repository.sortableFields).toStrictEqual(['name', 'created_at']);
      const defaultProps = {
        description: null,
        is_active: true
      }

      const categoriesProp = [
        {
          id: chance.guid({ version: 4 }),
          name: 'b',
          created_at: new Date(created_at.getTime() + 1000),
          ...defaultProps
        },
        {
          id: chance.guid({ version: 4 }),
          name: 'a',
          created_at: new Date(created_at.getTime() + 2000),
          ...defaultProps
        },
        {
          id: chance.guid({ version: 4 }),
          name: 'd',
          created_at: new Date(created_at.getTime() + 3000),
          ...defaultProps
        },
        {
          id: chance.guid({ version: 4 }),
          name: 'e',
          created_at: new Date(created_at.getTime() + 4000),
          ...defaultProps
        },
        {
          id: chance.guid({ version: 4 }),
          name: 'c',
          created_at: new Date(created_at.getTime() + 5000),
          ...defaultProps
        },
      ];
      const categories = await CategorySequelize.CategoryModel.bulkCreate(categoriesProp);

      const arrange = [
        {
          params: new CategoryRepository.SearchParams({ page: 1, per_page: 2, sort: 'name' }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategorySequelize.CategoryModelMapper.toEntity(categories[1]),
              CategorySequelize.CategoryModelMapper.toEntity(categories[0]),
            ],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({ page: 2, per_page: 2, sort: 'name' }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategorySequelize.CategoryModelMapper.toEntity(categories[4]),
              CategorySequelize.CategoryModelMapper.toEntity(categories[2]),
            ],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({ page: 1, per_page: 2, sort: 'name', sort_dir: 'desc' }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategorySequelize.CategoryModelMapper.toEntity(categories[3]),
              CategorySequelize.CategoryModelMapper.toEntity(categories[2]),
            ],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({ page: 2, per_page: 2, sort: 'name', sort_dir: 'desc' }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategorySequelize.CategoryModelMapper.toEntity(categories[4]),
              CategorySequelize.CategoryModelMapper.toEntity(categories[0]),
            ],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({ page: 1, per_page: 2, sort: 'is_active', sort_dir: 'desc' }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategorySequelize.CategoryModelMapper.toEntity(categories[4]),
              CategorySequelize.CategoryModelMapper.toEntity(categories[3]),
            ],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'is_active',
            sort_dir: 'desc',
            filter: null,
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result.toJSON(true)).toStrictEqual(i.result.toJSON(true));
      }
    });

    describe('should search using filter, sort and paginate', () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      }

      const categoriesProp = [
        { id: chance.guid({ version: 4 }), name: 'test', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TEST', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'e', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TeSt', ...defaultProps },
      ];

      const arrange = [
        {
          params: new CategoryRepository.SearchParams({ page: 1, per_page: 2, sort: 'name', filter: 'TEST' }),
          result: new CategoryRepository.SearchResult({
            items: [
              new Category(categoriesProp[2]),
              new Category(categoriesProp[4])
            ],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'TEST',
          }),
        },
        {
          params: new CategoryRepository.SearchParams({ page: 2, per_page: 2, sort: 'name', filter: 'TEST' }),
          result: new CategoryRepository.SearchResult({
            items: [
              new Category(categoriesProp[0])
            ],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'TEST',
          }),
        },
      ];

      beforeEach(async () => {
        await CategorySequelize.CategoryModel.bulkCreate(categoriesProp);
      });

      test.each(arrange)('when value is %j', async ({ params, result }) => {
        let searchResult = await repository.search(params);
        expect(searchResult.toJSON(true)).toStrictEqual(result.toJSON(true));
      });
    });
  });

});