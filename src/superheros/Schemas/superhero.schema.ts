import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Powers } from 'src/powers/schemas/power.schema';
import { PeopleSaved } from './people_saved.schema';
import * as mongoose from 'mongoose';

export type superheroDocument = HydratedDocument<Superheros>;

@Schema()
export class Superheros {
  @Prop({ type: String, length: 15, unique: true, required: true })
  hero_name: string;

  @Prop({ type: String, length: 30, unique: true, required: true })
  secret_identity: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PeopleSaved',
      },
    ],
  })
  people_saved: PeopleSaved[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Powers' }] })
  powers: Powers[];
}

export const SuperheroSchema = SchemaFactory.createForClass(Superheros);
