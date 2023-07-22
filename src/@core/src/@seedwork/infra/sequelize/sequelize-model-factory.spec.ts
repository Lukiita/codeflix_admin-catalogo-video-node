import _chance from 'chance';
import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { validate as uuidValidate } from 'uuid';
import { setupSequelize } from '../testing';
import { SequelizeModelFactory } from './sequelize-model-factory';

const chance = _chance();

@Table({})
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name;

  static mockFactory = jest.fn(() => ({
    id: chance.guid({ version: 4 }),
    name: chance.word(),
  }));

  static factory() {
    return new SequelizeModelFactory<StubModel, { id: string, name: string }>(StubModel, StubModel.mockFactory);
  }
}

describe('SequelizeModelFactory Tests', () => {
  setupSequelize({ models: [StubModel] });

  test('create methos', async () => {
    let model = await StubModel.factory().create();
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalled();

    let modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);

    model = await StubModel.factory().create({
      id: '48fac1a8-b6c0-40ab-8c58-e737b4635595',
      name: 'test'
    });
    expect(model.id).toBe('48fac1a8-b6c0-40ab-8c58-e737b4635595');
    expect(model.name).toBe('test');
    expect(StubModel.mockFactory).toBeCalledTimes(1);

    modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);
  });

  test('make methos', async () => {
    let model = StubModel.factory().make();
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalled();

    model = StubModel.factory().make({
      id: '48fac1a8-b6c0-40ab-8c58-e737b4635595',
      name: 'test'
    });
    expect(model.id).toBe('48fac1a8-b6c0-40ab-8c58-e737b4635595');
    expect(model.name).toBe('test');
    expect(StubModel.mockFactory).toBeCalledTimes(1);
  });

  test('bulkCreate method using count = 1', async () => {
    let models = await StubModel.factory().bulkCreate();
    expect(models).toHaveLength(1);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalled();

    let modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toBe(modelFound.id);
    expect(models[0].name).toBe(modelFound.name);

    models = await StubModel.factory().bulkCreate(() => ({
      id: '48fac1a8-b6c0-40ab-8c58-e737b4635595',
      name: 'test'
    }));
    expect(models[0].id).toBe('48fac1a8-b6c0-40ab-8c58-e737b4635595');
    expect(models[0].name).toBe('test');

    modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toBe(modelFound.id);
    expect(StubModel.mockFactory).toBeCalledTimes(1);
  });

  test('bulkCreate method using count > 1', async () => {
    let models = await StubModel.factory().count(2).bulkCreate();
    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(models[1].id).not.toBeNull();
    expect(models[1].name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalled();
    expect(StubModel.mockFactory).toBeCalledTimes(2);

    let modelFound1 = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toBe(modelFound1.id);
    expect(models[0].name).toBe(modelFound1.name);

    let modelFound2 = await StubModel.findByPk(models[1].id);
    expect(models[1].id).toBe(modelFound2.id);
    expect(models[1].name).toBe(modelFound2.name);

    models = await StubModel.factory().count(2).bulkCreate(() => ({
      id: chance.guid({ version: 4 }),
      name: 'test',
    }));
    expect(models[0].id).not.toBe(models[1].id);
    expect(models[0].name).toBe('test');
    expect(models[1].name).toBe('test');
    expect(StubModel.mockFactory).toBeCalledTimes(2);
  });

  test('bulkMake method using count = 1', async () => {
    let models = StubModel.factory().bulkMake();
    expect(models).toHaveLength(1);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalled();

    models = StubModel.factory().bulkMake(() => ({
      id: '48fac1a8-b6c0-40ab-8c58-e737b4635595',
      name: 'test'
    }));
    expect(models[0].id).toBe('48fac1a8-b6c0-40ab-8c58-e737b4635595');
    expect(models[0].name).toBe('test');
    expect(StubModel.mockFactory).toBeCalledTimes(1);
  });

  test('bulkMake method using count > 1', async () => {
    let models = StubModel.factory().count(2).bulkMake();
    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(models[1].id).not.toBeNull();
    expect(models[1].name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalled();
    expect(StubModel.mockFactory).toBeCalledTimes(2);

    models = StubModel.factory().count(2).bulkMake(() => ({
      id: chance.guid({ version: 4 }),
      name: 'test',
    }));
    expect(models[0].id).not.toBe(models[1].id);
    expect(models[0].name).toBe('test');
    expect(models[1].name).toBe('test');
    expect(StubModel.mockFactory).toBeCalledTimes(2);
  });
});