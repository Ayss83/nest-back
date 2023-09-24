import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Address } from './address.model';

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {
  @Prop({ required: true })
  num: number;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ type: Address })
  address: Address;

  @Prop({ unique: true })
  phone: string;

  @Prop({ required: true })
  ownerId: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
