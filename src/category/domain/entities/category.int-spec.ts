import ValidationError from '../../../@seedwork/errors/validation-error';
import { Category } from './category';

describe('Category Integration Tests', () => {

  describe('create method', () => {
    it('should a invalid category using name property', () => {
      expect(() => new Category({ name: null })).toThrow(new ValidationError('The name is required'));
      expect(() => new Category({ name: '' })).toThrow(new ValidationError('The name is required'));
      expect(() => new Category({ name: 5 as any })).toThrow(new ValidationError('The name must be a string'));
      expect(() => new Category({ name: 't'.repeat(256) })).toThrow(new ValidationError('The name must be less or equal than 255 characters'));
    });
  
    it('should a invalid category using description property', () => {
      expect(() => new Category({ name: 'Movie', description: 5 as any })).toThrow(new ValidationError('The description must be a string'));
    });
  
    it('should a invalid category using is_active property', () => {
      expect(() => new Category({ name: 'Movie', is_active: 5 as any })).toThrow(new ValidationError('The is_active must be a boolean'));
    });

    it('should a valid category', () => {
      expect.assertions(0);
      new Category({ name: 'Movie' });
      new Category({ name: 'Movie', description: 'Some description' });
      new Category({ name: 'Movie', description: null });
      new Category({ name: 'Movie', description: 'Some description', is_active: false });
      new Category({ name: 'Movie', description: 'Some description', is_active: true });
    });
  });

  describe('update method', () => {
    const category = new Category({ name: 'Movie' });

    it('should a invalid category using name property', () => {
      expect(() => category.update(null)).toThrow(new ValidationError('The name is required'));
      expect(() =>  category.update('')).toThrow(new ValidationError('The name is required'));
      expect(() =>  category.update(5 as any)).toThrow(new ValidationError('The name must be a string'));
      expect(() =>  category.update('t'.repeat(256))).toThrow(new ValidationError('The name must be less or equal than 255 characters'));
    });
  
    it('should a invalid category using description property', () => {
      expect(() => category.update('Movie', 5 as any)).toThrow(new ValidationError('The description must be a string'));
    });

    it('should a valid category', () => {
      expect.assertions(0);
      category.update('Name changed');
      category.update('Name changed', 'Description changed');
      category.update('Name changed', null);
    });
  });
});