import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type powerDocument = HydratedDocument<Powers>;

@Schema()
export class Powers {
  @Prop({ type: String, required: true, length: 20, unique: true })
  name: string;

  @Prop({ type: String, required: true, length: 200 })
  description: string;
}

export const PowerSchema = SchemaFactory.createForClass(Powers);
