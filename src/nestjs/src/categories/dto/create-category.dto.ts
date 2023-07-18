import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateCategoryUseCase } from 'codeflix/category/application';

export class CreateCategoryDto implements CreateCategoryUseCase.Input {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
