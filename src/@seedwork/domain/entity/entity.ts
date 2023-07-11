import UniqueEntityId from '#seedwork/domain/value-objects/unique-entity-id.vo';

export default abstract class Entity<Props = any> {
  public readonly uniqueEntityId: UniqueEntityId;

  constructor(public readonly props: Props, id?: UniqueEntityId) {
    this.uniqueEntityId = id || new UniqueEntityId();
  }

  public get id(): string {
    return this.uniqueEntityId.value;
  }

  public toJSON(): Required<{ id: string } & Props> { // Deixando todas as propriedades como obrigatórias ao instanciar entidade
    return {
      id: this.id,
      ...this.props,
    } as  Required<{ id: string } & Props>;
  } 
}