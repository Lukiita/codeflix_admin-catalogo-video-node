import Entity from '../../../domain/entity/entity';
import { InMemorySearchableRepository } from '../in-memory.repository';
import { SearchParams, SearchResult } from '../repository-contracts';

type StubEntityProps = {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps> { }

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name'];

  protected async applyFilter(items: StubEntity[], filter: string): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter(item => {
      return (
        item.props.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.props.price.toString() === filter
      );
    });
  }
}

describe('InMemorySearchableRepository Unit Tests', () => {
  let repository: StubInMemorySearchableRepository;

  beforeEach(() => repository = new StubInMemorySearchableRepository());

  describe('applyFilter function', () => {

    it('should no filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'name value', price: 5 })];
      const spyFilterFunction = jest.spyOn(items, 'filter');
      const filteredItems = await repository['applyFilter'](items, null);
      expect(filteredItems).toStrictEqual(items);
      expect(spyFilterFunction).not.toHaveBeenCalled();
    });

    it('should filter using a filter param', async () => {
      const items = [
        new StubEntity({ name: 'name value', price: 5 }),
        new StubEntity({ name: 'test', price: 10 }),
        new StubEntity({ name: 'TEST', price: 15 }),
        new StubEntity({ name: 'fake', price: 0 }),
      ];

      const spyFilterFunction = jest.spyOn(items, 'filter');
      let filteredItems = await repository['applyFilter'](items, 'TEST');
      expect(filteredItems).toStrictEqual([items[1], items[2]]);
      expect(spyFilterFunction).toHaveBeenCalledTimes(1);

      filteredItems = await repository['applyFilter'](items, '15');
      expect(filteredItems).toStrictEqual([items[2]]);
      expect(spyFilterFunction).toHaveBeenCalledTimes(2);

      filteredItems = await repository['applyFilter'](items, 'no-filter');
      expect(filteredItems).toHaveLength(0);
      expect(spyFilterFunction).toHaveBeenCalledTimes(3);
    })
  });

  describe('applySort function', () => {

    it('should no sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 10 }),
        new StubEntity({ name: 'a', price: 10 }),
      ];

      let filteredItems = await repository['applySort'](items, null, null);
      expect(filteredItems).toStrictEqual(items);

      filteredItems = await repository['applySort'](items, 'price', 'asc');
      expect(filteredItems).toStrictEqual(items);
    });

    it('should sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 10 }),
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'c', price: 10 }),
      ];

      let filteredItems = await repository['applySort'](items, 'name', 'asc');
      expect(filteredItems).toStrictEqual([items[1], items[0], items[2]]);

      filteredItems = await repository['applySort'](items, 'name', 'desc');
      expect(filteredItems).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe('applyPaginate function', () => {

    it('should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'b', price: 10 }),
        new StubEntity({ name: 'c', price: 15 }),
        new StubEntity({ name: 'd', price: 0 }),
        new StubEntity({ name: 'e', price: 0 }),
      ];

      const spyFilterFunction = jest.spyOn(items, 'slice');
      let filteredItems = await repository['applyPaginate'](items, 1, 2);
      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(spyFilterFunction).toHaveBeenCalledTimes(1);

      filteredItems = await repository['applyPaginate'](items, 2, 2);
      expect(filteredItems).toStrictEqual([items[2], items[3]]);
      expect(spyFilterFunction).toHaveBeenCalledTimes(2);

      filteredItems = await repository['applyPaginate'](items, 3, 2);
      expect(filteredItems).toStrictEqual([items[4]]);
      expect(spyFilterFunction).toHaveBeenCalledTimes(3);

      filteredItems = await repository['applyPaginate'](items, 4, 2);
      expect(filteredItems).toStrictEqual([]);
      expect(spyFilterFunction).toHaveBeenCalledTimes(4);
    });
  });

  describe('search function', () => {
    it('should apply only paginate when other params are null', async () => {
      const entity = new StubEntity({ name: 'a', price: 5 });
      const items = Array(16).fill(entity);
      repository.items = items;

      const result = await repository.search(new SearchParams());
      expect(result).toStrictEqual(new SearchResult({
        items: Array(15).fill(entity),
        total: 16,
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      }));
    });

    it('should apply paginate and filter', async () => {
      const items = [
        new StubEntity({ name: 'name value', price: 5 }),
        new StubEntity({ name: 'test', price: 10 }),
        new StubEntity({ name: 'TEST', price: 15 }),
        new StubEntity({ name: 'a', price: 0 }),
        new StubEntity({ name: 'TeSt', price: 5 }),
      ];
      repository.items = items;

      let result = await repository.search(
        new SearchParams({ page: 1, per_page: 2, filter: 'TEST' })
      );
      expect(result).toStrictEqual(new SearchResult({
        items: [items[1], items[2]],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: 'TEST',
      }));

      result = await repository.search(
        new SearchParams({ page: 2, per_page: 2, filter: 'TEST' })
      );
      expect(result).toStrictEqual(new SearchResult({
        items: [items[4]],
        total: 3,
        current_page: 2,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: 'TEST',
      }));
    });

    it('should apply paginate and sort', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'd', price: 15 }),
        new StubEntity({ name: 'e', price: 0 }),
        new StubEntity({ name: 'c', price: 5 }),
      ];
      repository.items = items;
      const arrange = [
        {
          params: new SearchParams({ page: 1, per_page: 2, sort: 'name' }),
          result: new SearchResult({
            items: [items[1], items[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: null,
          }),
        },
        {
          params: new SearchParams({ page: 2, per_page: 2, sort: 'name' }),
          result: new SearchResult({
            items: [items[4], items[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: null,
          }),
        },
        {
          params: new SearchParams({ page: 1, per_page: 2, sort: 'name', sort_dir: 'desc' }),
          result: new SearchResult({
            items: [items[3], items[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: null,
          }),
        },
        {
          params: new SearchParams({ page: 2, per_page: 2, sort: 'name', sort_dir: 'desc' }),
          result: new SearchResult({
            items: [items[4], items[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: null,
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result).toStrictEqual(i.result);
      }
    });

    it('should search using filter, sort and paginate', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'TEST', price: 15 }),
        new StubEntity({ name: 'e', price: 0 }),
        new StubEntity({ name: 'TesT', price: 5 }),
      ];
      repository.items = items;
      const arrange = [
        {
          params: new SearchParams({ page: 1, per_page: 2, sort: 'name', filter: 'TEST' }),
          result: new SearchResult({
            items: [items[2], items[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'TEST',
          }),
        },
        {
          params: new SearchParams({ page: 2, per_page: 2, sort: 'name', filter: 'TEST' }),
          result: new SearchResult({
            items: [items[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'TEST',
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result).toStrictEqual(i.result);
      }
    });
  });
});