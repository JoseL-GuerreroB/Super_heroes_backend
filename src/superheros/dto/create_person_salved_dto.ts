import {
  IsIn,
  IsInt,
  IsPositive,
  IsString,
  Length,
  Max,
  ValidationArguments,
} from 'class-validator';

export default class Create_Person_DTO {
  @IsString({
    message: 'El nombre del rescatado debe ser un caracter',
  })
  @Length(4, 100, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El nombre del rescatado es requerido.';
      else if (arg.value.length <= 3)
        return 'El nombre del rescatado debe contener al menos 4 caracteres.';
      else
        return 'El nombre del rescatado debe contener por lo mucho 100 caracteres';
    },
  })
  full_name: string;

  @IsInt({
    message: 'La edad debe ser un numero entero',
  })
  @IsPositive({
    message: 'La edad debe ser un numero positivo',
  })
  @Max(200, {
    message: 'La edad no debe pasar de los 200 años',
  })
  age: number;

  @IsIn(['Masculino', 'Femenino'], {
    message: 'El genero no esta dentro de las opciones de selección',
  })
  gender: string;
}
