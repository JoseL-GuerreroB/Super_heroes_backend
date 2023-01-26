import { OmitType } from '@nestjs/mapped-types';
import User_Register_DTO from './register_dto';

export default class Update_User_DTO extends OmitType(User_Register_DTO, [
  'password',
] as const) {}
