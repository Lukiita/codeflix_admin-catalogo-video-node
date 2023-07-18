import { SortDirection } from 'codeflix/@seedwork/domain';
import { ListCategoriesUseCase } from 'codeflix/category/application';
export class SearchCategoryDto implements ListCategoriesUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}