import { IsString, Length, ValidationArguments } from 'class-validator';

export default class Create_Power_DTO {
  @IsString({
    message: 'El nombre del poder debe ser un caracter',
  })
  @Length(3, 60, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El nombre del poder es requerido.';
      else if (arg.value.length <= 2)
        return 'El nombre del poder debe contener al menos 3 caracteres.';
      else
        return 'El nombre del poder debe contener por lo mucho 60 caracteres';
    },
  })
  name: string;

  @IsString({
    message: 'La descripción debe ser un caracter',
  })
  @Length(3, 200, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'La descripción es requerido.';
      else if (arg.value.length <= 2)
        return 'La descripción debe contener al menos 3 caracteres.';
      else return 'La descripción debe contener por lo mucho 200 caracteres';
    },
  })
  description: string;
}
