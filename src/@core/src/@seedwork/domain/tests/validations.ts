import { EntityValidationError } from '../errors/validation-error';
import ClassValidatorFields from '../validators/class-validator-fields';
import { FieldsErros } from '../validators/validator-fields.interface';


type Expected = { validator: ClassValidatorFields<any>, data: any } | (() => any);

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsErros) {
    if (typeof expected === 'function') {
      try {
        expected();
        return isValid();
      } catch (e) {
        const { error } = e as EntityValidationError;
        return assertContainsErrorMessages(error, received);
      }
    }

    const { validator, data } = expected;
    const validated = validator.validate(data);
    if (validated) {
      return isValid();
    }

    return assertContainsErrorMessages(validator.errors, received);
  }
});

function isValid() {
  return { pass: true, message: () => '' };
}

function assertContainsErrorMessages(expected: FieldsErros, received: FieldsErros) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected);
  return isMatch ?
    isValid() :
    {
      pass: false,
      message: () =>
        `The validation errors not contains ${JSON.stringify(received)}. Current: ${JSON.stringify(expected)}`
    }
}