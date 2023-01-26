import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import Create_Person_DTO from '../dto/create_person_salved_dto';
import Update_Person_DTO from '../dto/update_person_salved_dto';
import PeopleSavedService from '../services/people_saved.service';
import SuperherosService from '../services/superheros.service';

@Controller('superheros')
export default class PeopleSavedController {
  constructor(
    private superheroService: SuperherosService,
    private peopleSavedService: PeopleSavedService,
  ) {}

  @Get(':id/people_saved')
  @UseGuards(AuthGuard('jwt'))
  async Find_All_People(@Param('id') idSuperhero: string) {
    try {
      return await this.peopleSavedService.Find_All_People_Service(idSuperhero);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post(':id/people_saved')
  @UseGuards(AuthGuard('jwt'))
  async Create_Person(
    @Param('id') idSuperhero: string,
    @Body() personData: Create_Person_DTO,
  ) {
    try {
      const superhero = await this.superheroService.Find_One_Superhero_Service(
        idSuperhero,
      );
      return await this.peopleSavedService.Create_Person_Saved_Service(
        superhero.id,
        personData,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':sid/people_saved/:pid')
  @UseGuards(AuthGuard('jwt'))
  async Find_One_Person(
    @Param('sid') idSuperhero: string,
    @Param('pid') idPerson: string,
  ) {
    try {
      return await this.peopleSavedService.Find_One_Person_Service(
        idPerson,
        idSuperhero,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':sid/people_saved/:pid')
  @UseGuards(AuthGuard('jwt'))
  async Update_Person(
    @Param('sid') idSuperhero: string,
    @Param('pid') idPerson: string,
    @Body() data: Update_Person_DTO,
  ) {
    try {
      return await this.peopleSavedService.Update_Person_Service(
        idPerson,
        idSuperhero,
        data,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':sid/people_saved/:pid')
  @UseGuards(AuthGuard('jwt'))
  async Delete_Person(
    @Param('sid') idSuperhero: string,
    @Param('pid') idPerson: string,
  ) {
    try {
      return await this.peopleSavedService.Delete_Person_Service(
        idPerson,
        idSuperhero,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
