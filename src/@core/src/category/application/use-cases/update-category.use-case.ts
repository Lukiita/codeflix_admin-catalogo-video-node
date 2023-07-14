import IUseCase from '#seedwork/application/use-case';
import CategoryRepository from '../../domain/repositories/category.repository';
import { CategoryOutputDto, CategoryOutputMapper } from '../dto/category-output';

export namespace UpdateCategoryUseCase {
  export class UseCase implements IUseCase<Input, Output> {
  
    constructor(private categoryRepo: CategoryRepository.Repository) {}
  
    async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepo.findById(input.id);
      entity.update(input.name, input.description);
  
      if (input.is_active === true) {
        entity.activate();
      }
  
      if (input.is_active === false) {
        entity.deactivate();
      } 
  
      await this.categoryRepo.update(entity);
      return CategoryOutputMapper.toOutput(entity);
    }
  }
  
  export type Input = {
    id: string;
    name: string;
    description?: string;
    is_active?: boolean;
  }
  
  export type Output = CategoryOutputDto;
}