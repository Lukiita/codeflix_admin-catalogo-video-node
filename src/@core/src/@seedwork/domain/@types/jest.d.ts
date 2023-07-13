import { FieldsErros } from '../validators/validator-fields.interface';

declare global {
  namespace jest {
    interface Matchers<R>{
      containsErrorMessages: (expected: FieldsErros) => R;
    }
  }
}