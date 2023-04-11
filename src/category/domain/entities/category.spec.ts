import UniqueEntityId from '../../../@seedwork/domain/value-objects/unique-entity-id.vo';
import { Category, CategoryProperties } from './category';

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
    type CategoryData = { props: CategoryProperties, id?: UniqueEntityId };
    const data: CategoryData[] = [
      { props: { name: 'Movie' } },
      { props: { name: 'Movie' }, id: null },
      { props: { name: 'Movie' }, id: undefined },
      { props: { name: 'Movie' }, id: new UniqueEntityId() },
    ];

    data.forEach(props => {
      const category = new Category(props.props, props.id);      
      expect(category.id).not.toBeNull();
      expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
      if (props.id) {
        expect(category.id).toBe(props.id.value);
      }
    });
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