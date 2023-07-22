import { FieldsErros } from '../validators';

export class LoadEntityError extends Error {
  constructor(public error: FieldsErros, message?: string) {
    super(message ?? 'An entity not be loaded');
    this.name = 'LoadEntityError';
  }
}