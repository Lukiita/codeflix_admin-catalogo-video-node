import { validateSync } from 'class-validator';
import IValidatorFields, { FieldsErros } from './validator-fields.interface';

export default abstract class ClassValidatorFields<PropsValidated> implements IValidatorFields<PropsValidated> {

  public errors: FieldsErros = null;
  public validateData: PropsValidated = null;

  public validate(data: any): boolean {
    const errors = validateSync(data);
    if (errors.length) {
      this.errors = {};
      for(const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints);
      }
    } else {
      this.validateData = data;
    }

    return !errors.length;
  }
}