import { SortDirection } from '../../domain/repositories/repository-contracts';

export type SearchInputDto = {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}