import * as libClassValidator from 'class-validator';
import ClassValidatorFields from './class-validator-fields';

class StubClassValidator extends ClassValidatorFields<{ field: string }> { }

describe('ClassValidatorFields Unit Tests', () => {
  it('should initialize errors and validatedData variables with null', () => {
    const validator = new StubClassValidator();
    expect(validator.errors).toBeNull();
    expect(validator.validateData).toBeNull();
  });
  
  it('should validate with errors', () => {
    const spyValidateAsync = jest
    .spyOn(libClassValidator, 'validateSync')
    .mockReturnValue([
      {
        property: 'field',
        constraints: {
          isRequired: 'some error'
        }
      },
    ]);
    const validator = new StubClassValidator();
    
    expect(validator.validate(null)).toBeFalsy();
    expect(spyValidateAsync).toBeCalled();
    expect(validator.validateData).toBeNull();
    expect(validator.errors).toStrictEqual({field: ['some error']});
  });

  it('should validate without errors', () => {
    const spyValidateAsync = jest
    .spyOn(libClassValidator, 'validateSync')
    .mockReturnValue([]);
    const validator = new StubClassValidator();
    
    expect(validator.validate({field: 'value'})).toBeTruthy();
    expect(spyValidateAsync).toBeCalled();
    expect(validator.validateData).toStrictEqual({field: 'value'});
    expect(validator.errors).toBeNull();
  });
});