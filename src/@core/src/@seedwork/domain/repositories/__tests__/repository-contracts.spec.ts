import { SearchParams, SearchResult } from '../repository-contracts';

describe('Search Unit Tests', () => {
  describe('SearchParams Unit Tests', () => {
    test('page prop', () => {
      const arrange: { per_page: any, expected: number }[] = [
        { per_page: null, expected: 1 },
        { per_page: undefined, expected: 1 },
        { per_page: '', expected: 1 },
        { per_page: 'fake', expected: 1 },
        { per_page: 0, expected: 1 },
        { per_page: -1, expected: 1 },
        { per_page: 5.5, expected: 1 },
        { per_page: true, expected: 1 },
        { per_page: false, expected: 1 },
        { per_page: {}, expected: 1 },
  
        { per_page: 1, expected: 1 },
        { per_page: 2, expected: 2 },
      ];
  
      arrange.forEach(item => {
        expect(new SearchParams({ page: item.per_page }).page).toBe(item.expected);
      });
    });
  
    test('per_page prop', () => {
      const arrange: { per_page: any, expected: number }[] = [
        { per_page: null, expected: 15 },
        { per_page: undefined, expected: 15 },
        { per_page: '', expected: 15 },
        { per_page: 'fake', expected: 15 },
        { per_page: 0, expected: 15 },
        { per_page: -1, expected: 15 },
        { per_page: 5.5, expected: 15 },
        { per_page: true, expected: 15 },
        { per_page: false, expected: 15 },
        { per_page: {}, expected: 15 },
  
        { per_page: 1, expected: 1 },
        { per_page: 2, expected: 2 },
        { per_page: 10, expected: 10 },
      ];
  
      arrange.forEach(item => {
        expect(new SearchParams({ per_page: item.per_page }).per_page).toBe(item.expected);
      });
    });
  
    test('sort prop', () => {
      let params = new SearchParams();
      expect(params.sort).toBeNull();
  
      const arrange: { sort: any, expected: string }[] = [
        { sort: null, expected: null },
        { sort: undefined, expected: null },
        { sort: '', expected: null },
        { sort: 0, expected: '0' },
        { sort: -1, expected: '-1' },
        { sort: 5.5, expected: '5.5' },
        { sort: true, expected: 'true' },
        { sort: false, expected: 'false' },
        { sort: {}, expected: '[object Object]' },
  
        { sort: 'valid field', expected: 'valid field' },
      ];
  
      arrange.forEach(item => {
        expect(new SearchParams({ sort: item.sort }).sort).toBe(item.expected);
      });
    });
  
    test('sort_dir prop', () => {
      let params = new SearchParams();
      expect(params.sort_dir).toBeNull();
  
      params = new SearchParams({ sort: null });
      expect(params.sort_dir).toBeNull();
  
      params = new SearchParams({ sort: undefined });
      expect(params.sort_dir).toBeNull();
  
      params = new SearchParams({ sort: '' });
      expect(params.sort_dir).toBeNull();
  
      const arrange: { sort_dir: any, expected: string }[] = [
        { sort_dir: null, expected: 'asc' },
        { sort_dir: undefined, expected: 'asc' },
        { sort_dir: '', expected: 'asc' },
        { sort_dir: 0, expected: 'asc' },
        { sort_dir: -1, expected: 'asc' },
        { sort_dir: 'fake', expected: 'asc' },
        { sort_dir: true, expected: 'asc' },
        { sort_dir: false, expected: 'asc' },
        { sort_dir: {}, expected: 'asc' },
  
        { sort_dir: 'asc', expected: 'asc' },
        { sort_dir: 'ASC', expected: 'asc' },
        { sort_dir: 'desc', expected: 'desc' },
        { sort_dir: 'DESC', expected: 'desc' },
      ];
  
      arrange.forEach(item => {
        expect(new SearchParams({ sort: 'field', sort_dir: item.sort_dir }).sort_dir).toBe(item.expected);
      });
    });
  
    test('filter prop', () => {
      let params = new SearchParams();
      expect(params.filter).toBeNull();
  
      const arrange: { filter: any, expected: string }[] = [
        { filter: null, expected: null},
        { filter: undefined, expected: null},
        { filter: '', expected: null},
        { filter: 0, expected: '0' },
        { filter: -1, expected: '-1' },
        { filter: 5.5, expected: '5.5' },
        { filter: true, expected: 'true' },
        { filter: false, expected: 'false' },
        { filter: {}, expected: '[object Object]' },
  
        { filter: 'valid field', expected: 'valid field' },
      ];
  
      arrange.forEach(item => {
        expect(new SearchParams({ filter: item.filter }).filter).toBe(item.expected);
      });
    });
  });
  
  describe('SearchResult Unit Tests', () => {
  
    test('constructor props', () => {
      let result = new SearchResult({
        items: ['entity 1', 'entity 2'] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: null
      });
  
      expect(result.toJSON()).toStrictEqual({
        items: ['entity 1', 'entity 2'] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        last_page: 2,
        sort: null,
        sort_dir: null,
        filter: null
      });
  
      result = new SearchResult({
        items: ['entity 1', 'entity 2'] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: 'test'
      });
  
      expect(result.toJSON()).toStrictEqual({
        items: ['entity 1', 'entity 2'] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        last_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: 'test'
      });
    });
  
    it('should set last_page 1 when per_page field is greater than total fields', () => {
      let result = new SearchResult({
        items: [],
        total: 4,
        current_page: 1,
        per_page: 15,
        sort: 'name',
        sort_dir: 'asc',
        filter: 'test'
      });
  
      expect(result.last_page).toBe(1);
    });
  
    test('last_page prop when total is not a multiple of per_page', () => {
      let result = new SearchResult({
        items: [],
        total: 101,
        current_page: 1,
        per_page: 20,
        sort: 'name',
        sort_dir: 'asc',
        filter: 'test'
      });
  
      expect(result.last_page).toBe(6);
    });
  });
});
