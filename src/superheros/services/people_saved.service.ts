import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Create_Person_DTO from '../dto/create_person_salved_dto';
import Update_Person_DTO from '../dto/update_person_salved_dto';
import {
  PeopleSaved,
  peopleSavedDocument,
} from '../Schemas/people_saved.schema';
import { superheroDocument, Superheros } from '../Schemas/superhero.schema';

@Injectable()
export default class PeopleSavedService {
  constructor(
    @InjectModel(PeopleSaved.name)
    private PeopleSavedModel: Model<peopleSavedDocument>,
    @InjectModel(Superheros.name)
    private SuperheroModel: Model<superheroDocument>,
  ) {}

  async Find_All_People_Service(idSuperhero: string) {
    const peopleSavedArray = await this.SuperheroModel.findOne(
      {
        _id: idSuperhero,
      },
      {
        _id: false,
        people_saved: true,
      },
    );
    if (!peopleSavedArray)
      throw new HttpException(
        'No hay registros de ese superheroe',
        HttpStatus.NOT_FOUND,
      );
    const people = await this.PeopleSavedModel.find({
      _id: { $in: peopleSavedArray.people_saved },
    });
    return people;
  }

  async Create_Person_Saved_Service(
    idSuperhero: string,
    personData: Create_Person_DTO,
  ) {
    const findPersonName = await this.PeopleSavedModel.findOne(
      {
        full_name: personData.full_name,
      },
      {
        _id: false,
        full_name: true,
      },
    );
    if (findPersonName)
      throw new HttpException(
        'La persona ya fue salvada por otro superheroe.',
        HttpStatus.CONFLICT,
      );
    const newPerson = new this.PeopleSavedModel(personData);
    const person = await newPerson.save();
    const superhero = await this.SuperheroModel.findOne({
      _id: idSuperhero,
    });
    const newDataSuperhero = {
      people_saved: superhero.people_saved,
    };
    newDataSuperhero.people_saved.push(person);
    console.log(newDataSuperhero.people_saved);
    await this.SuperheroModel.findByIdAndUpdate(
      idSuperhero,
      { $set: newDataSuperhero },
      { new: true },
    );
    return person;
  }

  async ValidatorSuperheroAndPerson(idPerson: string, idSuperhero: string) {
    const superhero = await this.SuperheroModel.findOne({
      _id: idSuperhero,
    }).populate({
      path: 'people_saved',
      select: '_id',
    });
    if (!superhero)
      throw new HttpException(
        'Superheroe no encontrado.',
        HttpStatus.NOT_FOUND,
      );
    const person = await this.PeopleSavedModel.findOne({
      _id: idPerson,
    });
    if (!person)
      throw new HttpException(
        'Persona rescatada no registrada.',
        HttpStatus.NOT_FOUND,
      );
    const capturePerson = superhero.people_saved.filter(
      (atr) => atr['id'] === person.id,
    );
    if (capturePerson.length === 0)
      throw new HttpException(
        'La persona no fue rescatada por este superheroe',
        HttpStatus.NOT_FOUND,
      );
    return { person, superhero };
  }

  async Find_One_Person_Service(idPerson: string, idSuperhero: string) {
    const { person } = await this.ValidatorSuperheroAndPerson(
      idPerson,
      idSuperhero,
    );
    return person;
  }

  async ValidateUniqueDate(
    id: string,
    uniqueData: string,
    newUniqueData: string,
  ) {
    const findFullName = await this.PeopleSavedModel.findOne({
      full_name: newUniqueData,
    });
    if (findFullName) {
      if (newUniqueData === uniqueData && id === findFullName.id) return false;
      if (newUniqueData === uniqueData && id !== findFullName.id)
        throw new HttpException(
          'El nombre del superheroe ya esta registrado.',
          HttpStatus.CONFLICT,
        );
      else return findFullName.full_name;
    }
    return newUniqueData;
  }

  async Update_Person_Service(
    idPerson: string,
    idSuperhero: string,
    newDataPerson: Update_Person_DTO,
  ) {
    const { person } = await this.ValidatorSuperheroAndPerson(
      idPerson,
      idSuperhero,
    );
    const findFullName = await this.ValidateUniqueDate(
      idPerson,
      person.full_name,
      newDataPerson.full_name,
    );
    if (findFullName === false) newDataPerson.full_name = undefined;
    const newData = newDataPerson;
    return await this.PeopleSavedModel.findByIdAndUpdate(
      idPerson,
      { $set: newData },
      { new: true },
    );
  }

  async Delete_Person_Service(idPerson: string, idSuperhero: string) {
    const { person, superhero } = await this.ValidatorSuperheroAndPerson(
      idPerson,
      idSuperhero,
    );
    const newDataPeopleFromSuperhero = superhero.people_saved.filter(
      (atr) => atr['id'] !== idPerson,
    );
    await this.SuperheroModel.findByIdAndUpdate(
      idSuperhero,
      { $set: { people_saved: newDataPeopleFromSuperhero } },
      { new: true },
    );
    await this.PeopleSavedModel.findByIdAndRemove(person.id);
    return { ok: true, message: 'La persona se ha eliminado exitosamente' };
  }
}
