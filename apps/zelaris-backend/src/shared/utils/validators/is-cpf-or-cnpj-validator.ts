import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCpfOrCnpj',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value || typeof value !== 'string') return false;

          if (!/^[0-9.-/]+$/.test(value)) return false;

          const cleanValue = value.replace(/[^\d]/g, '');

          if (cleanValue.length === 11) {
            return cpf.isValid(value);
          } else if (cleanValue.length === 14) {
            return cnpj.isValid(value);
          }

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CPF ou CNPJ válido`;
        },
      },
    });
  };
}
