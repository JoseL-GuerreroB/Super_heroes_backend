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
import Create_Power_DTO from './dto/create_power_dto';
import Update_Power_DTO from './dto/update_power_dto';
import PowersService from './powers.service';

@Controller('powers')
export default class PowersController {
  constructor(private readonly powersService: PowersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async Find_All_Powers() {
    try {
      return await this.powersService.Find_All_Powers_Service();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async Create_Power(@Body() data: Create_Power_DTO) {
    try {
      return await this.powersService.Create_Power_Service(data);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async Find_Power(@Param('id') id: string) {
    try {
      return await this.powersService.Find_Power_Service(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async Update_Power(@Body() data: Update_Power_DTO, @Param('id') id: string) {
    try {
      return await this.powersService.Update_Power_Service(id, data);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async Delete_Power(@Param('id') id: string) {
    try {
      return await this.powersService.Delete_Power_Service(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
