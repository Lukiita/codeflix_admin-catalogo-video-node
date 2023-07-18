import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoryUseCase, ListCategoriesUseCase, UpdateCategoryUseCase } from 'codeflix/category/application';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase.UseCase)
  private createUseCase: CreateCategoryUseCase.UseCase;

  @Inject(ListCategoriesUseCase.UseCase)
  private listUseCase: ListCategoriesUseCase.UseCase;

  @Inject(GetCategoryUseCase.UseCase)
  private getUseCase: GetCategoryUseCase.UseCase;

  @Inject(UpdateCategoryUseCase.UseCase)
  private updateUseCase: UpdateCategoryUseCase.UseCase;

  @Inject(DeleteCategoryUseCase.UseCase)
  private deleteUseCase: DeleteCategoryUseCase.UseCase;

  @Post()
  public create(@Body() createCategoryDto: CreateCategoryDto): Promise<CreateCategoryUseCase.Output> {
    return this.createUseCase.execute(createCategoryDto);
  }

  @Get()
  public search(@Query() searchParams: SearchCategoryDto): Promise<ListCategoriesUseCase.Output> {
    return this.listUseCase.execute(searchParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getUseCase.execute({id});
  }

  @Put(':id')
  public update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<UpdateCategoryUseCase.Output> {
    return this.updateUseCase.execute({id, ...updateCategoryDto});
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public remove(@Param('id') id: string): Promise<void> {
    return this.deleteUseCase.execute({id});
  }
}
