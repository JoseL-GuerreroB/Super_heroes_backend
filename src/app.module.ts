import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PowersModule } from './powers/powers.module';
import { SuperherosModule } from './superheros/superheros.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    MongooseModule.forRoot(process.env.MONGODB_ATLAS_URL),
    AuthModule,
    PowersModule,
    SuperherosModule,
  ],
})
export class AppModule {}
