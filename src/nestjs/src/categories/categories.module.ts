import { Module } from '@nestjs/common';
import { CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoryUseCase, ListCategoriesUseCase, UpdateCategoryUseCase } from 'codeflix/category/application';
import { CategoryInMemoryRepository } from 'codeflix/category/infra';
import CategoryRepository from 'codeflix/dist/category/domain/repositories/category.repository';
import { CategoriesController } from './categories.controller';

@Module({
  controllers: [CategoriesController],
  providers: [
    {
      provide: 'CategoryRepository',
      useClass: CategoryInMemoryRepository
    },
    {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new CreateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryRepository']
    },
    {
      provide: ListCategoriesUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new ListCategoriesUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryRepository']
    },
    {
      provide: GetCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new GetCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryRepository']
    },
    {
      provide: UpdateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new UpdateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryRepository']
    },
    {
      provide: DeleteCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new DeleteCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryRepository']
    },
  ]
})
export class CategoriesModule { }
