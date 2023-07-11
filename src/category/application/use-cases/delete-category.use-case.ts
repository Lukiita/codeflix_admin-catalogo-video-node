import IUseCase from '../../../@seedwork/application/use-case';
import CategoryRepository from '../../domain/repositories/category.repository';

export default class DeleteCategoryUseCase implements IUseCase<Input, Output> {

  constructor(private categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<void> {
    const entity = await this.categoryRepo.findById(input.id);
    await this.categoryRepo.delete(entity.id);
  }
}

export type Input = {
  id: string;
}

export type Output = void;