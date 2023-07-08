import IUseCase from '../../../@seedwork/application/use-case';
import CategoryRepository from '../../domain/repositories/category.repository';
import { CategoryOutputDto, CategoryOutputMapper } from '../dto/category-output';

export default class GetCreateCategoryUseCase implements IUseCase<Input, CategoryOutputDto>  {

  constructor(private categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<CategoryOutputDto> {
    const entity = await this.categoryRepo.findById(input.id);

    return CategoryOutputMapper.toOutput(entity);
  }
}

export type Input = {
  id: string;
}
