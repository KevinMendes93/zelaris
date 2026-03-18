import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { cpf } from 'cpf-cnpj-validator';

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (!/^[0-9.-]+$/.test(value)) return false;
          return cpf.isValid(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid cpf`;
        },
      },
    });
  };
}
