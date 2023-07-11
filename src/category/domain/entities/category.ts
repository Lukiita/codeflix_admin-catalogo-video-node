import Entity from '#seedwork/domain/entity/entity';
import { EntityValidationError } from '#seedwork/domain/errors/validation-error';
import UniqueEntityId from '#seedwork/domain/value-objects/unique-entity-id.vo';
import CategoryValidatorFactory from '../validators/category.validator';

export type CategoryProperties = {
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
}

export class Category extends Entity<CategoryProperties> {
  constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
    Category.validate(props);
    
    super(props, id);
    this.description = this.description;
    this.is_active = this.is_active;
    this.created_at = this.created_at;
  }

  public get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  public get description(): string {
    return this.props.description;
  }

  private set description(value: string) {
    this.props.description = value ?? null;
  }

  public get is_active(): boolean {
    return this.props.is_active;
  }

  private set is_active(value: boolean) {
    this.props.is_active = value ?? true;
  }

  public get created_at(): Date {
    return this.props.created_at;
  }

  private set created_at(value: Date) {
    this.props.created_at = value ?? new Date();
  }

  public update(name: string, description?: string): void {
    Category.validate({name, description});

    this.name = name;
    this.description = description;
  }

  // static validate(props: Omit<CategoryProperties, 'created_at'>) {
  //   ValidatorRules.values(props.name, 'name').required().string().maxLength(255);
  //   ValidatorRules.values(props.description, 'description').string();
  //   ValidatorRules.values(props.is_active, 'is_active').boolean();
  // }

  static validate(props: CategoryProperties): void {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(props);

    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  public activate(): void {
    this.is_active = true;
  }

  public deactivate(): void {
    this.is_active = false;
  }
}