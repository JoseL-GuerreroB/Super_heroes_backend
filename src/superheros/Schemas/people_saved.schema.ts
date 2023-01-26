import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type peopleSavedDocument = HydratedDocument<PeopleSaved>;

@Schema()
export class PeopleSaved {
  @Prop({ type: String, required: true, unique: true, length: 100 })
  full_name: string;

  @Prop({ type: Number, required: true })
  age: number;

  @Prop({ type: String, required: true, length: 15 })
  gender: string;
}

export const PeopleSavedSchema = SchemaFactory.createForClass(PeopleSaved);
