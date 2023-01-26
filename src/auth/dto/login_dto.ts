import { OmitType } from '@nestjs/mapped-types';
import User_Register_DTO from './register_dto';

export default class Login_DTO extends OmitType(User_Register_DTO, [
  'name',
] as const) {}
