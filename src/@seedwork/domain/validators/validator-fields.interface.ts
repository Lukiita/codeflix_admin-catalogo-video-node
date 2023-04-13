export type FieldsErros = {
  [field: string]: string[]; 
}

export default interface IValidatorFields<PropsValidated> {
  errors: FieldsErros;
  validateData: PropsValidated;

  validate(data: any): boolean;
}