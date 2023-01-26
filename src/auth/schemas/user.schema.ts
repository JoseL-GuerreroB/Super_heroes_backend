import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type userDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop({ type: String, required: true, length: 60 })
  name: string;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Date, default: Date.now })
  createAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(Users);
