import { validate as uuidValidate } from 'uuid';
import { Category } from './category';
describe('Category Tests', () => {

  afterEach(() => {
    jest.useRealTimers();
  });

  test('constructor of category', () => {
    const createdAt = new Date(2023, 5, 5);
    jest.useFakeTimers().setSystemTime(createdAt);

    let category = new Category({ name: 'Movie' });
    expect(category.props).toStrictEqual({
      name: 'Movie',
      description: null,
      is_active: true,
      created_at: createdAt
    });

    category = new Category({
      name: 'Movie',
      description: 'some description',
      is_active: false,
      created_at: createdAt
    });
    expect(category.props).toStrictEqual({
      name: 'Movie',
      description: 'some description',
      is_active: false,
      created_at: createdAt
    });

    category = new Category({
      name: 'Movie',
      description: 'other description',
    });
    expect(category.props).toMatchObject({
      name: 'Movie',
      description: 'other description',
    });

    category = new Category({
      name: 'Movie',
      is_active: true
    });
    expect(category.props).toMatchObject({
      name: 'Movie',
      is_active: true
    });
    
    category = new Category({
      name: 'Movie',
      created_at: new Date(2023, 5, 5)
    });
    expect(category.props).toMatchObject({
      name: 'Movie',
      created_at: new Date(2023, 5, 5)
    });
  });

  test('id prop', ()=> {
    let category = new Category({ name: 'Movie' });
    expect(category.id).not.toBeNull();
    expect(uuidValidate(category.id)).toBeTruthy();

    category = new Category({ name: 'Movie' }, null);
    expect(category.id).not.toBeNull();
    expect(uuidValidate(category.id)).toBeTruthy();

    category = new Category({ name: 'Movie' }, undefined);
    expect(category.id).not.toBeNull();
    expect(uuidValidate(category.id)).toBeTruthy();

    const id = '48fac1a8-b6c0-40ab-8c58-e737b4635595';
    category = new Category({ name: 'Movie' }, id);
    expect(category.id).toBe(id);
    expect(uuidValidate(category.id)).toBeTruthy();
  });

  test('getter of name prop', () => {
    const category = new Category({ name: 'Movie' });
    expect(category.name).toBe('Movie');
  });

  test('getter and setter of description prop', () => {
    let category = new Category({ name: 'Movie' });
    expect(category.description).toBeNull();

    category = new Category({ 
      name: 'Movie',
      description: 'Movie description'
    });
    expect(category.description).toBe('Movie description');

    category = new Category({ name: 'Movie' });
    category['description'] = 'Other movie description';
    expect(category.description).toBe('Other movie description');
    
    category['description'] = undefined;
    expect(category.description).toBeNull();
  });

  test('getter and setter of is_active prop', () => {
    let category = new Category({ name: 'Movie' });
    expect(category.is_active).toBeTruthy();

    category = new Category({ 
      name: 'Movie',
      is_active: true
    });
    expect(category.is_active).toBeTruthy();

    category = new Category({ 
      name: 'Movie',
      is_active: false
    });
    expect(category.is_active).toBeFalsy();
  });

  test('getter and setter of created_at prop', () => {
    let category = new Category({ name: 'Movie' });
    expect(category.created_at).toBeInstanceOf(Date);

    let createdAt=  new Date();
    category = new Category({ name: 'Movie', created_at: createdAt});
    expect(category.created_at).toBe(createdAt);
  });
});