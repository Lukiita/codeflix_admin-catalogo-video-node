import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  ISearchableRepository,
} from '../../../@seedwork/domain/repositories/repository-contracts';
import { Category } from '../entities/category';

export namespace CategoryRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<Category, Filter> { }

  export interface Repository extends ISearchableRepository<Category, Filter, SearchParams, SearchResult> { }
}

export default CategoryRepository;