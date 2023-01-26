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
import Create_Superhero_DTO from '../dto/create_superhero_dto';
import Update_Superhero_DTO from '../dto/update_superhero_dto';
import SuperherosService from '../services/superheros.service';

@Controller('superheros')
export default class SuperherosController {
  constructor(private readonly superherosService: SuperherosService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async Find_All_Superheros() {
    try {
      return await this.superherosService.Find_All_Superheros_Service();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async Create_Superhero(@Body() data: Create_Superhero_DTO) {
    try {
      return await this.superherosService.Create_Superhero_Service(data);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async Find_One_Superhero(@Param('id') id: string) {
    try {
      return await this.superherosService.Find_One_Superhero_Service(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async Update_Superhero(
    @Param('id') id: string,
    @Body() data: Update_Superhero_DTO,
  ) {
    try {
      return await this.superherosService.Update_Superhero_Service(id, data);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async Delete_Superhero(@Param('id') id: string) {
    try {
      return await this.superherosService.Delete_Superhero_Service(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
