import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Create_Power_DTO from './dto/create_power_dto';
import Update_Power_DTO from './dto/update_power_dto';
import { powerDocument, Powers } from './schemas/power.schema';

@Injectable()
export default class PowersService {
  constructor(
    @InjectModel(Powers.name) private PowerModel: Model<powerDocument>,
  ) {}

  async Find_All_Powers_Service() {
    return await this.PowerModel.find();
  }

  async Create_Power_Service(data: Create_Power_DTO) {
    const thePowerExist = await this.PowerModel.findOne(
      {
        name: data.name,
      },
      {
        name: true,
      },
    );
    if (thePowerExist)
      throw new HttpException('Este poder ya existe', HttpStatus.CONFLICT);
    const newPower = new this.PowerModel(data);
    return newPower.save();
  }

  async Find_Power_Service(id: string) {
    const power = await this.PowerModel.findOne({
      _id: id,
    });
    if (!power)
      throw new HttpException(
        'El poder que quieres editar no existe',
        HttpStatus.NOT_FOUND,
      );
    return power;
  }

  async Update_Power_Service(id: string, data: Update_Power_DTO) {
    const power = await this.PowerModel.findOne(
      {
        _id: id,
      },
      {
        _id: true,
        name: true,
      },
    );
    if (!power)
      throw new HttpException(
        'El poder que quieres editar no existe',
        HttpStatus.NOT_FOUND,
      );
    const findPower = await this.PowerModel.findOne(
      {
        name: data.name,
      },
      {
        _id: true,
        name: true,
      },
    );
    if (findPower) {
      if (power.name === findPower.name && power.id === findPower.id)
        data.name = undefined;
      else if (power.name === findPower.name && power.id !== findPower.id)
        throw new HttpException(
          'El poder que ingresaste ya esta registrado',
          HttpStatus.CONFLICT,
        );
      else data.name = findPower.name;
    }
    const newPowerData = data;
    return await this.PowerModel.findByIdAndUpdate(
      id,
      { $set: newPowerData },
      { new: true },
    );
  }

  async Delete_Power_Service(id: string) {
    const power = await this.PowerModel.findOne(
      {
        _id: id,
      },
      {
        _id: true,
      },
    );
    if (!power)
      throw new HttpException(
        'El poder que quieres eliminar no existe',
        HttpStatus.NOT_FOUND,
      );
    await this.PowerModel.findByIdAndRemove(id);
    return { ok: true, message: 'El poder se elimino exitosamente' };
  }

  async Find_All_Powers_From_Superhero(idPowers: string[]) {
    const powers = await this.PowerModel.find({
      _id: { $in: idPowers },
    });
    return powers;
  }
}
