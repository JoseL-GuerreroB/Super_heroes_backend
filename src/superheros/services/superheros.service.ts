import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import PowersService from 'src/powers/powers.service';
import Create_Superhero_DTO from '../dto/create_superhero_dto';
import Update_Superhero_DTO from '../dto/update_superhero_dto';
import {
  PeopleSaved,
  peopleSavedDocument,
} from '../Schemas/people_saved.schema';
import { superheroDocument, Superheros } from '../Schemas/superhero.schema';

@Injectable()
export default class SuperherosService {
  constructor(
    @InjectModel(Superheros.name)
    private SuperheroModel: Model<superheroDocument>,
    @InjectModel(PeopleSaved.name)
    private PeopleSavedModel: Model<peopleSavedDocument>,
    private powerService: PowersService,
  ) {}

  async Find_All_Superheros_Service() {
    return await this.SuperheroModel.find();
  }

  async ValidatePowers(powers: string[]) {
    if (powers.length === 0)
      throw new HttpException(
        'No puedes crear heroes sin poderes',
        HttpStatus.CONFLICT,
      );
    const lengthArray = [];
    powers.forEach((id) => {
      if (!lengthArray.includes(id)) lengthArray.push(id);
    });
    if (powers.length !== lengthArray.length)
      throw new HttpException(
        'No puedes incluir poderes repetidos',
        HttpStatus.CONFLICT,
      );
  }

  async Create_Superhero_Service(data: Create_Superhero_DTO) {
    this.ValidatePowers(data.powers);
    const findSuperHero = await this.SuperheroModel.findOne({
      $or: [
        { hero_name: data.hero_name },
        { secret_identity: data.secret_identity },
      ],
    });
    if (findSuperHero)
      throw new HttpException(
        'El heroe que ingresaste ya existe o cambio de identidad',
        HttpStatus.CONFLICT,
      );
    const powers = await this.powerService.Find_All_Powers_From_Superhero(
      data.powers,
    );
    const newSuperhero: object = data;
    newSuperhero['powers'] = powers;
    newSuperhero['people_saved'] = [];
    const superhero = new this.SuperheroModel(newSuperhero);
    return await superhero.save();
  }

  async Find_One_Superhero_Service(id: string) {
    const superhero = await this.SuperheroModel.findOne({
      _id: id,
    });
    if (!superhero)
      throw new HttpException(
        'Superheroe no encontrado.',
        HttpStatus.NOT_FOUND,
      );
    return superhero;
  }

  async ValidateUniqueDate(
    id: string,
    uniqueData: string,
    newUniqueData: string,
    atribute?: string,
  ) {
    if (atribute === 'hero_name') {
      const findSuperhero = await this.SuperheroModel.findOne({
        hero_name: newUniqueData,
      });
      if (findSuperhero) {
        if (newUniqueData === uniqueData && id === findSuperhero.id)
          return false;
        if (newUniqueData === uniqueData && id !== findSuperhero.id)
          throw new HttpException(
            'El nombre del superheroe ya esta registrado.',
            HttpStatus.CONFLICT,
          );
        else return findSuperhero.hero_name;
      }
      return newUniqueData;
    } else {
      const findEntity = await this.SuperheroModel.findOne({
        secret_identity: newUniqueData,
      });
      if (findEntity) {
        if (newUniqueData === uniqueData && id === findEntity.id) return false;
        if (newUniqueData === uniqueData && id !== findEntity.id)
          throw new HttpException(
            'El nombre del superheroe ya esta registrado.',
            HttpStatus.CONFLICT,
          );
        else return findEntity.secret_identity;
      }
      return newUniqueData;
    }
  }

  async Update_Superhero_Service(id: string, data: Update_Superhero_DTO) {
    this.ValidatePowers(data.powers);
    const superhero = await this.SuperheroModel.findOne(
      {
        _id: id,
      },
      {
        _id: true,
        hero_name: true,
        secret_identity: true,
      },
    );
    if (!superhero)
      throw new HttpException(
        'El superheroe que quieres editar no exite',
        HttpStatus.NOT_FOUND,
      );
    const findHeroName = await this.ValidateUniqueDate(
      superhero.id,
      superhero.hero_name,
      data.hero_name,
      'hero_name',
    );
    if (findHeroName === false) data.hero_name = undefined;
    const findSecretIdentity = await this.ValidateUniqueDate(
      superhero.id,
      superhero.hero_name,
      data.hero_name,
    );
    if (findSecretIdentity === false) data.secret_identity = undefined;
    const powers = await this.powerService.Find_All_Powers_From_Superhero(
      data.powers,
    );
    const newData: object = data;
    newData['powers'] = powers;
    return await this.SuperheroModel.findByIdAndUpdate(
      id,
      { $set: newData },
      { new: true },
    );
  }

  async Delete_Superhero_Service(id: string) {
    const superhero = await this.SuperheroModel.findOne(
      {
        _id: id,
      },
      {
        _id: true,
        people_saved: true,
      },
    ).populate({
      path: 'people_saved',
      select: '_id',
    });
    if (!superhero)
      throw new HttpException(
        'El superheroe que quieres editar no exite',
        HttpStatus.NOT_FOUND,
      );
    console.log(superhero);
    console.log(superhero.people_saved);
    if (superhero.people_saved.length > 0)
      await Promise.allSettled(
        superhero.people_saved.map(async (atr) => {
          await this.PeopleSavedModel.findByIdAndRemove(atr['id']);
        }),
      );
    await this.SuperheroModel.findByIdAndRemove(id);
    return { ok: true, message: 'El superheroe se elimino exitosamente' };
  }
}
