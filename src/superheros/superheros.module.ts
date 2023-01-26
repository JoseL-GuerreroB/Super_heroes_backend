import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Superheros, SuperheroSchema } from './Schemas/superhero.schema';
import { PowersModule } from 'src/powers/powers.module';
import SuperherosController from './controllers/superheros.controller';
import SuperherosService from './services/superheros.service';
import { PeopleSaved, PeopleSavedSchema } from './Schemas/people_saved.schema';
import PeopleSavedController from './controllers/people_saved.controller';
import PeopleSavedService from './services/people_saved.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Superheros.name,
        schema: SuperheroSchema,
      },
      {
        name: PeopleSaved.name,
        schema: PeopleSavedSchema,
      },
    ]),
    PowersModule,
  ],
  controllers: [SuperherosController, PeopleSavedController],
  providers: [SuperherosService, PeopleSavedService],
})
export class SuperherosModule {}
