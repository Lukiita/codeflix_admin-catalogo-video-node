import { Category } from '../../domain/entities/category';
import CategoryInMemoryRepository from './category-in-memory.repository';

describe('CategoryInMemoryRepository Unit Tests', () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => repository = new CategoryInMemoryRepository());


  describe('applyFilter function', () => {
    it('should no filter items when filter param is null', async () => {
      const items = [new Category({ name: 'Movies', description: 'some description' })];
      const spyFilterFunction = jest.spyOn(items, 'filter');

      const filteredItems = await repository['applyFilter'](items, null);
      expect(filteredItems).toStrictEqual(items);
      expect(spyFilterFunction).not.toHaveBeenCalled();
    });

    it('should filter using a filter param', async () => {
      const items = [
        new Category({ name: 'Movies' }),
        new Category({ name: 'TV shows' }),
      ];

      const spyFilterFunction = jest.spyOn(items, 'filter');
      let filteredItems = await repository['applyFilter'](items, 'MOVIES');
      expect(filteredItems).toStrictEqual([items[0]]);
      expect(spyFilterFunction).toHaveBeenCalledTimes(1);

      filteredItems = await repository['applyFilter'](items, 'TV');
      expect(filteredItems).toStrictEqual([items[1]]);
      expect(spyFilterFunction).toHaveBeenCalledTimes(2);

      filteredItems = await repository['applyFilter'](items, 's');
      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(spyFilterFunction).toHaveBeenCalledTimes(3);

      filteredItems = await repository['applyFilter'](items, 'invalid filter');
      expect(filteredItems).toHaveLength(0);
      expect(spyFilterFunction).toHaveBeenCalledTimes(4);
    });
  });

  describe('applySort function', function () {
    it('should sort by created_at when sort param is null', async () => {
      const createdAt = new Date();

      const items = [
        new Category({ name: 'Movies', created_at: createdAt }),
        new Category({ name: 'TV Shows', created_at: new Date(createdAt.getTime() + 1000) }),
        new Category({ name: 'Cartoons', created_at: new Date(createdAt.getTime() - 1000) }),
      ];

      let sortedItems = await repository['applySort'](items, null, null);
      expect(sortedItems).toStrictEqual([items[1], items[0], items[2]]);

      sortedItems = await repository['applySort'](items, 'created_at', 'asc');
      expect(sortedItems).toStrictEqual([items[2], items[0], items[1]]);
    });

    it('should sort by name', async () => {
      const items = [
        new Category({ name: 'Movies' }),
        new Category({ name: 'TV Shows' }),
        new Category({ name: 'Cartoons' }),
      ];

      let sortedItems = await repository['applySort'](items, 'name', 'asc');
      expect(sortedItems).toStrictEqual([items[2], items[0], items[1]]);

      sortedItems = await repository['applySort'](items, 'name', 'desc');
      expect(sortedItems).toStrictEqual([items[1], items[0], items[2]]);
    });
  });

});