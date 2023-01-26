import {
  Controller,
  Get,
  HttpException,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import SesionService from '../services/sesion.service';
import TokenService from '../services/token.service';

@Controller('app')
export default class SesionController {
  constructor(
    private sesionService: SesionService,
    private tokenService: TokenService,
  ) {}

  @Get('presesion')
  @UseGuards(AuthGuard('jwt-refresh'))
  async Presesion(@Req() req: Request) {
    try {
      const token = await this.tokenService.generateAccessToken(req.user['id']);
      return { token };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('sesion')
  @UseGuards(AuthGuard('jwt'))
  async Sesion(@Req() req: Request) {
    try {
      const uid = req.user['id'];
      const user = await this.sesionService.Sesion_Service(uid);
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('close_sesion')
  @UseGuards(AuthGuard('jwt'))
  async Close_Sesion(@Res({ passthrough: true }) res: Response) {
    try {
      res.clearCookie('refresh_token');
      return { ok: true, message: 'Sesion terminada' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async Find_All_Users() {
    try {
      return await this.sesionService.Find_All_Users_Service();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('users/:id')
  @UseGuards(AuthGuard('jwt'))
  async Find_User(@Param('id') id: string) {
    try {
      return await this.sesionService.Find_User(id);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
