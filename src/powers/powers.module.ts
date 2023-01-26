import { Module } from '@nestjs/common';
import PowersService from './powers.service';
import PowersController from './powers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Powers, PowerSchema } from './schemas/power.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Powers.name,
        schema: PowerSchema,
      },
    ]),
  ],
  controllers: [PowersController],
  providers: [PowersService],
  exports: [PowersService],
})
export class PowersModule {}
