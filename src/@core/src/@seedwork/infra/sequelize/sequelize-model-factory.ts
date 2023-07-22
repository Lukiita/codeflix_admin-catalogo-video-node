import { Model } from 'sequelize-typescript';

export class SequelizeModelFactory<ModelClass extends Model, ModelProps = any> {

  private _count = 1;

  constructor(private model: any, private defaultFactoryProps: () => ModelProps) { }

  public async create(data?: ModelProps): Promise<ModelClass> {
    return this.model.create(data ? data : this.defaultFactoryProps());
  }

  public count(count: number): this {
    this._count = count;
    return this;
  }

  public make(data?: ModelProps): ModelClass {
    return this.model.build(data ? data : this.defaultFactoryProps());
  }

  public async bulkCreate(factoryProps?: (index: number) => ModelProps): Promise<ModelClass[]> {
    const data = new Array(this._count)
      .fill(factoryProps ? factoryProps : this.defaultFactoryProps)
      .map((factory, index) => factory(index))
    return this.model.bulkCreate(data);
  }

  public bulkMake(factoryProps?: (index: number) => ModelProps): ModelClass[] {
    const data = new Array(this._count)
      .fill(factoryProps ? factoryProps : this.defaultFactoryProps)
      .map((factory, index) => factory(index))
    return this.model.bulkBuild(data);
  }
}

