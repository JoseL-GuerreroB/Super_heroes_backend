import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { userDocument, Users } from '../schemas/user.schema';

@Injectable()
export default class SesionService {
  constructor(
    @InjectModel(Users.name) private UserModel: Model<userDocument>,
  ) {}

  async Sesion_Service(id: number) {
    const user = await this.UserModel.findOne({
      _id: id,
    });
    if (!user)
      throw new HttpException(
        'El usuario ya fue eliminado',
        HttpStatus.NOT_FOUND,
      );
    user.password = undefined;
    return user;
  }

  async Find_All_Users_Service() {
    return await this.UserModel.find(
      {},
      {
        password: false,
      },
    );
  }
  async Find_User(id: string) {
    return await this.UserModel.findOne(
      {
        _id: id,
      },
      {
        password: false,
      },
    );
  }
}
