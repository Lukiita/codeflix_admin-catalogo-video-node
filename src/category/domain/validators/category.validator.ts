import ClassValidatorFields from '@seedwork/domain/validators/class-validator-fields';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CategoryProperties } from '../entities/category';

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;

  @IsDate()
  @IsOptional()
  created_at: Date;
  

  constructor(data: CategoryProperties) {
    Object.assign(this, data);
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  public validate(data: CategoryProperties): boolean {
      return super.validate(new CategoryRules(data));
  }
}

export default class CategoryValidatorFactory {
  static create(): CategoryValidator {
    return new CategoryValidator();
  }
}