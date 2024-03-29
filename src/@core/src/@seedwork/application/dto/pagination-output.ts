import { SearchResult } from '#seedwork/domain';

export type PaginationOutputDto<Items = any> = {
  items: Items[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

export class PaginationOutputMapper {
  static toOutput(searchResult: SearchResult): Omit<PaginationOutputDto, 'items'>{
    return {
      total: searchResult.total,
      current_page: searchResult.current_page,
      last_page: searchResult.last_page,
      per_page: searchResult.per_page,
    }
  }
}