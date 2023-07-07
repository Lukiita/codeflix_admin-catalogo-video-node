import IUseCase from '../../../@seedwork/application/use-case';
import CategoryRepository from '../../domain/repositories/category.repository';
import { CategoryOutputDto } from '../dto/category-output.dto';

export default class GetCreateCategoryUseCase implements IUseCase<Input, CategoryOutputDto>  {

  constructor(private categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<CategoryOutputDto> {
    const entity = await this.categoryRepo.findById(input.id);

    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at
    }
  }
}

export type Input = {
  id: string;
}
