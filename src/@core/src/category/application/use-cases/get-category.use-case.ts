import IUseCase from '#seedwork/application/use-case';
import CategoryRepository from '../../domain/repositories/category.repository';
import { CategoryOutputDto, CategoryOutputMapper } from '../dto/category-output';

export namespace GetCategoryUseCase {
  export class UseCase implements IUseCase<Input, Output>  {
  
    constructor(private categoryRepo: CategoryRepository.Repository) {}
  
    async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepo.findById(input.id);
  
      return CategoryOutputMapper.toOutput(entity);
    }
  }
  
  export type Input = {
    id: string;
  }

  export type Output = CategoryOutputDto;
}