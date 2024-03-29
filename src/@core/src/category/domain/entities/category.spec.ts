import UniqueEntityId from '#seedwork/domain/value-objects/unique-entity-id.vo';
import { Category, CategoryProperties } from './category';

describe('Category Tests', () => {

  beforeEach(() => {
    Category.validate = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('constructor of category', () => {
    const createdAt = new Date(2023, 5, 5);
    jest.useFakeTimers().setSystemTime(createdAt);

    let category = new Category({ name: 'Movie' });
    expect(Category.validate).toBeCalled();
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

  describe('id prop', ()=> {
    type CategoryData = { props: CategoryProperties, id?: UniqueEntityId };
    const arrange: CategoryData[] = [
      { props: { name: 'Movie' } },
      { props: { name: 'Movie' }, id: null },
      { props: { name: 'Movie' }, id: undefined },
      { props: { name: 'Movie' }, id: new UniqueEntityId() },
    ];

    test.each(arrange)('when props is %j', (props) => {
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
  
  it('should update a category', () => {
    const category = new Category({ name: 'Movie' });
    expect(category.name).toBe('Movie');
    expect(category.description).toBeNull();

    category.update('New Category');
    expect(category.name).toBe('New Category');
    expect(category.description).toBeNull();

    category.update('New category 2', 'Description of category');
    expect(category.name).toBe('New category 2');
    expect(category.description).toBe('Description of category');
    expect(Category.validate).toBeCalledTimes(3);
  });

  it('should active a category', () => {
    const category = new Category({ name: 'Movie', is_active: false });
    expect(category.name).toBe('Movie');
    expect(category.is_active).toBeFalsy();

    category.activate();
    expect(category.name).toBe('Movie');
    expect(category.is_active).toBeTruthy();
  });

  it('should disable a category', () => {
    const category = new Category({ name: 'Movie'});
    expect(category.name).toBe('Movie');
    expect(category.is_active).toBeTruthy();

    category.deactivate();
    expect(category.name).toBe('Movie');
    expect(category.is_active).toBeFalsy();
  });
});