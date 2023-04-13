import { validate as uuidValidate } from 'uuid';
import InvalidUuidError from '../errors/invalid-uuid.error';
import UniqueEntityId from './unique-entity-id.vo';

describe('UniqueEntityId Unit Tests', () => {
  const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, 'validate');
  
  it('should throw error when uuid is invalid', () => {
    expect(() => new UniqueEntityId('invalid id')).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should accept a uuid passed in constructor', () => {
    const uuid = '48fac1a8-b6c0-40ab-8c58-e737b4635595';
    const vo = new UniqueEntityId(uuid);
    expect(vo.value).toBe(uuid);
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should generate a uuid when not passed in the constructor', () => {
    const vo = new UniqueEntityId();
    expect(uuidValidate(vo.value)).toBeTruthy()
    expect(validateSpy).toHaveBeenCalled();
  });
});