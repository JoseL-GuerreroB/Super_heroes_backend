import {
  IsMongoId,
  IsString,
  Length,
  ValidationArguments,
} from 'class-validator';

export default class Create_Superhero_DTO {
  @IsString({
    message: 'El nombre del heroe debe ser un caracter',
  })
  @Length(2, 15, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El username es requerido.';
      else if (arg.value.length <= 1)
        return 'El nombre del heroe debe contener al menos 2 caracteres.';
      else
        return 'El nombre del heroe debe contener por lo mucho 15 caracteres';
    },
  })
  hero_name: string;

  @IsString({
    message: 'El nombre real debe ser un caracter',
  })
  @Length(3, 30, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El username es requerido.';
      else if (arg.value.length <= 2)
        return 'El nombre real debe contener al menos 3 caracteres.';
      else return 'El nombre real debe contener por lo mucho 30 caracteres';
    },
  })
  secret_identity: string;

  @IsMongoId({
    each: true,
    message: 'El dato $value no es un idMongo valido',
  })
  powers: string[];
}
