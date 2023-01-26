import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  ValidationArguments,
} from 'class-validator';

export default class User_Register_DTO {
  @IsString({
    message: 'El nombre debe ser un caracter',
  })
  @Length(3, 60, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El nombre es requerido.';
      else if (arg.value.length <= 2)
        return 'El nombre debe contener al menos 3 caracteres.';
      else return 'El nombre debe contener por lo mucho 60 caracteres';
    },
  })
  name: string;

  @IsEmail(undefined, {
    message: 'El correo que introduciste no es valido',
  })
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'La contraseña debe tener 8 caracteres como minimo, un numero, una letra en mayuscula y un simbolo.',
    },
  )
  password: string;
}
