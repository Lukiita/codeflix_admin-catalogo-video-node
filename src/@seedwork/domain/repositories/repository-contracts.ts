import Entity from '../entity/entity';
import UniqueEntityId from '../value-objects/unique-entity-id.vo';

export interface IRepository<E extends Entity> {
  insert(entity: E): Promise<void>;
  findById(id: string | UniqueEntityId): Promise<E>;
  findAll(): Promise<E[]>;
  update(entity: E): Promise<void>;
  delete(id: string | UniqueEntityId): Promise<void>;
}

export type SortDirection = 'asc' | 'desc';

export type SearchProps<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: Filter;
}

export class SearchParams {
  protected _page: number;
  protected _per_page: number = 15;
  protected _sort: string | null;
  protected _sort_dir: SortDirection | null;
  protected _filter: string | null;

  constructor(props: SearchProps = {}) {
    this.page = props.page;
    this.per_page = props.per_page;
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }

  public get page(): number {
    return this._page;
  }

  private set page(value: number) {
    let _page = +value;

    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page.toString()) !== _page) {
      _page = 1;
    }

    this._page = _page;
  }

  public get per_page(): number {
    return this._per_page;
  }

  private set per_page(value: number) {
    let _per_page = value === true as any ? this._per_page : +value;

    const isInvalidValue = Number.isNaN(_per_page) || _per_page <= 0 || parseInt(_per_page.toString()) !== _per_page;
    if (isInvalidValue) {
      _per_page = this._per_page;
    }

    this._per_page = _per_page;
  }

  public get sort(): string {
    return this._sort;
  }

  private set sort(value: string | null) {
    const isEmptyValue = value === null || value === undefined || value === '';
    this._sort = isEmptyValue ? null : `${value}`;
  }

  public get sort_dir(): SortDirection {
    return this._sort_dir;
  }

  private set sort_dir(value: SortDirection | null) {
    if (!this.sort) {
      this._sort_dir = null;
      return;
    }

    const dir = `${value}`.toLowerCase();
    this._sort_dir = dir !== 'asc' && dir !== 'desc' ? 'asc' : dir;
  }

  public get filter(): string {
    return this._filter;
  }

  private set filter(value: string) {
    const isEmptyValue = value === null || value === undefined || value === '';
    this._filter = isEmptyValue ? null : `${value}`;
  }
}

type SearchResultProps<E extends Entity, Filter> = {
  items: E[];
  total: number;
  current_page: number;
  per_page: number;
  sort: string | null;
  sort_dir: SortDirection;
  filter: Filter;
}

export class SearchResult<E extends Entity, Filter = string> {
  public readonly items: E[];
  public readonly total: number;
  public readonly current_page: number;
  public readonly per_page: number;
  public readonly last_page: number;
  public readonly sort: string | null;
  public readonly sort_dir: SortDirection;
  public readonly filter: Filter;

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.last_page = Math.ceil(this.total / this.per_page);
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }

  public toJSON() {
    return {
      items: this.items,
      total: this.total,
      current_page: this.current_page,
      per_page: this.per_page,
      last_page: Math.ceil(this.total / this.per_page),
      sort: this.sort,
      sort_dir: this.sort_dir,
      filter: this.filter,
    }
  }
}

export interface ISearchableRepository<
  E extends Entity,
  Filter = string,
  SearchInput = SearchParams,
  SearchOutput = SearchResult<E, Filter>
> extends IRepository<E> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}