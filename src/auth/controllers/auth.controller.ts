import {
  Body,
  Controller,
  Delete,
  HttpException,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import AuthService from '../services/auth.service';
import Update_Password_User_DTO from '../dto/edit_password_dto';
import Update_User_DTO from '../dto/edit_user_dto';
import User_Register_DTO from '../dto/register_dto';
import TokenService from '../services/token.service';
import { Request, Response } from 'express';
import Login_DTO from '../dto/login_dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Post('register')
  async Register(
    @Res({ passthrough: true }) res: Response,
    @Body() data: User_Register_DTO,
  ) {
    try {
      const user = await this.authService.Register_Service(data);
      await this.tokenService.generateRefreshToken(user.id, res);
      return { ok: true };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('login')
  async Login(
    @Res({ passthrough: true }) res: Response,
    @Body() data: Login_DTO,
  ) {
    try {
      const user = await this.authService.Login_Service(data);
      await this.tokenService.generateRefreshToken(user.id, res);
      return { ok: true };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('edit_user')
  @UseGuards(AuthGuard('jwt'))
  async Edit_User(@Body() data: Update_User_DTO, @Req() req: Request) {
    try {
      const id = req.user['id'];
      return await this.authService.Update_User_Service(id, data);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch('edit_password')
  @UseGuards(AuthGuard('jwt'))
  async Edit_Password_User(
    @Body() data: Update_Password_User_DTO,
    @Req() req: Request,
  ) {
    try {
      const id = req.user['id'];
      return await this.authService.Update_Password_Service(id, data);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('delete_user')
  @UseGuards(AuthGuard('jwt'))
  async Delete_User(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const id = req.user['id'];
      res.clearCookie('refresh_token');
      return await this.authService.Delete_User_Service(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
