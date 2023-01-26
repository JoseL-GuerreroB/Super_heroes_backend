import { PickType } from '@nestjs/mapped-types';
import User_Register_DTO from './register_dto';

export default class Update_Password_User_DTO extends PickType(
  User_Register_DTO,
  ['password'] as const,
) {}
