import UniqueEntityId from '../../../@seedwork/domain/unique-entity-id.vo';

export type CategoryProperties = {
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
}

export class Category {
  public readonly id: UniqueEntityId;

  constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
    this.id = id || new UniqueEntityId();
    this.description = this.description;
    this.is_active = this.is_active;
    this.created_at = this.created_at;
  }

  public get name(): string {
    return this.props.name;
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
}