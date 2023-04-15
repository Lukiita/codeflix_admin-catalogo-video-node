import Entity from '../entity/entity';
import NotFoundError from '../errors/not-found.error';
import UniqueEntityId from '../value-objects/unique-entity-id.vo';
import { InMemoryRepository } from './in-memory.repository';

type StubEntityProps = {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps>{}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository Unit Tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => repository = new StubInMemoryRepository())

  it('should inserts a new entity', async () => {
    const entity = new StubEntity({name: 'name value', price: 5 });
    await repository.insert(entity);
    expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON())
  }); 

  it('should throw error when entity not found', () => {
    const uuid = '48fac1a8-b6c0-40ab-8c58-e737b4635595';
    expect(repository.findById('fake id')).rejects.toThrow(new NotFoundError(`Entity Not Found using ID fake id`));
    expect(repository.findById(new UniqueEntityId(uuid))).rejects.toThrow(new NotFoundError(`Entity Not Found using ID ${uuid}`));
  });

  it('should finds entity by id', async () => {
    const entity = new StubEntity({name: 'name value', price: 5 });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it('should finds entity by id', async () => {
    const entity1 = new StubEntity({name: 'entity 1', price: 5 });
    await repository.insert(entity1);

    const entity2 = new StubEntity({name: 'entity 2', price: 10 });
    await repository.insert(entity2);

    const entities = await repository.findAll();
    expect(entities).toHaveLength(2);
    expect(entities).toStrictEqual([entity1, entity2]);
  });

  it('should throw error on update when entity not found', () => {
    const entity = new StubEntity({name: 'name value', price: 5 });
    expect(repository.update(entity)).rejects.toThrow(new NotFoundError(`Entity Not Found using ID ${entity.id}`));
  });

  it('should updates an entity', async () => {
    const entity = new StubEntity({name: 'name value', price: 5 });
    await repository.insert(entity);
    
    const entityUpdated = new StubEntity({ name: 'updated', price: 1 }, entity.uniqueEntityId);

    await repository.update(entityUpdated);
    expect(entityUpdated.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it('should throw error on delete when entity not found', () => {
    const uuid = '48fac1a8-b6c0-40ab-8c58-e737b4635595';
    expect(repository.delete('fake id')).rejects.toThrow(new NotFoundError(`Entity Not Found using ID fake id`));
    expect(repository.delete(new UniqueEntityId(uuid))).rejects.toThrow(new NotFoundError(`Entity Not Found using ID ${uuid}`));
  });

  it('should deletes an entity', async () => {
    let entity = new StubEntity({name: 'name value', price: 5 });
    await repository.insert(entity);

    await repository.delete(entity.id);
    expect(repository.items).toHaveLength(0);

    await repository.insert(entity);

    await repository.delete(entity.uniqueEntityId);
    expect(repository.items).toHaveLength(0);
    
  });
});