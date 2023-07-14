export type FieldsErros = {
  [field: string]: string[]; 
}

export interface IValidatorFields<PropsValidated> {
  errors: FieldsErros;
  validateData: PropsValidated;

  validate(data: any): boolean;
}

export default IValidatorFields;