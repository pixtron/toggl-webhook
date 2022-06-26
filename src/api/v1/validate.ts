import * as Validations from './schemas/validations.js';

export class ValidationError extends Error {
  constructor(public override message: string, public errors: Array<unknown>) {
    super(message);
  }
}

export default (schemaId: string, data: unknown, throwErros = true ): {
  result: boolean,
  errors: Array<unknown>
} => {
  const validationKeys = Object.keys(Validations);
  let result = true;
  let errors = [];

  if (validationKeys.includes(schemaId)) {
    // @ts-ignore
    const validation = Validations[schemaId];

    result = validation(data);

    if (result === false) errors = validation.errors || [];
  }

  if ( result === false && throwErros === true) {
    throw new ValidationError('Invalid param passed', errors);
  }

  return { result, errors }
}
