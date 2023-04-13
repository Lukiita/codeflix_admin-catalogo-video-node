import { FieldsErros } from '../validators/validator-fields.interface';

export class ValidationError extends Error {}

export class EntityValidationError extends Error {
  constructor(public error: FieldsErros) {
    super('Entity validation error');
    this.name = 'EntityValidationError';
  }
}