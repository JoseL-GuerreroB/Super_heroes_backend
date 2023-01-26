import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import AuthService from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, Users } from './schemas/user.schema';
import SesionController from './controllers/sesion.controller';
import SesionService from './services/sesion.service';
import TokenService from './services/token.service';
import RefreshTokenStrategy from './helpers/strategies/refresh_token.strategy';
import AccessTokenStrategy from './helpers/strategies/access_token.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController, SesionController],
  providers: [
    RefreshTokenStrategy,
    AccessTokenStrategy,
    TokenService,
    AuthService,
    SesionService,
  ],
  exports: [],
})
export class AuthModule {}
