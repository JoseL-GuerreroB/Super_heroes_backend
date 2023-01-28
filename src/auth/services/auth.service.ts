import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Update_Password_User_DTO from '../dto/edit_password_dto';
import Update_User_DTO from '../dto/edit_user_dto';
import Login_DTO from '../dto/login_dto';
import User_Register_DTO from '../dto/register_dto';
import { comparePasswords, encryptPassword } from '../helpers/bcrypt';
import { userDocument, Users } from '../schemas/user.schema';

@Injectable()
export default class AuthService {
  constructor(
    @InjectModel(Users.name) private UserModel: Model<userDocument>,
  ) {}

  async Register_Service(data: User_Register_DTO) {
    const user = await this.UserModel.findOne(
      {
        email: data.email,
      },
      {
        email: true,
        _id: false,
      },
    );
    if (user)
      throw new HttpException(
        `El correo ${user.email} ya esta registrado`,
        HttpStatus.CONFLICT,
      );
    data.password = await encryptPassword(data.password);
    const newUser = new this.UserModel(data);
    return newUser.save();
  }

  async Login_Service(data: Login_DTO) {
    const user = await this.UserModel.findOne({
      email: data.email,
    });
    console.log(user);
    if (!user)
      throw new HttpException('Error de credenciales.', HttpStatus.NOT_FOUND);
    const thePasswordIsCorrect = await comparePasswords(
      data.password,
      user.password,
    );
    if (thePasswordIsCorrect === false)
      throw new HttpException('Error de credenciales.', HttpStatus.CONFLICT);
    return user;
  }

  async Update_User_Service(id: number, data: Update_User_DTO) {
    const findEmail = await this.UserModel.findOne(
      {
        email: data.email,
      },
      {
        email: true,
        _id: true,
      },
    );
    if (findEmail) {
      const user = await this.UserModel.findOne(
        {
          _id: id,
        },
        {
          email: true,
          _id: true,
        },
      );
      if (user.email === findEmail.email && user.id === findEmail.id)
        data.email = undefined;
      else if (user.email === findEmail.email && user.id !== findEmail.id)
        throw new HttpException(
          'El correo que ingresaste ya lo tiene otro usuario',
          HttpStatus.CONFLICT,
        );
      else data.email = findEmail.email;
    }
    const newUserData = data;
    const userData = await this.UserModel.findByIdAndUpdate(
      id,
      { $set: newUserData },
      { new: true },
    );
    userData.password = undefined;
    return userData;
  }

  async Update_Password_Service(id: number, data: Update_Password_User_DTO) {
    data.password = await encryptPassword(data.password);
    await this.UserModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    return { ok: true, message: 'Tu contraseña fue cambiada' };
  }

  async Delete_User_Service(id: number) {
    await this.UserModel.findByIdAndRemove(id);
    return { ok: true, message: 'Tu usuario se elimino exitosamente' };
  }
}
