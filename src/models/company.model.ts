import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema()
export class Company {
  @Prop()
  registrationNumber: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  address2: string;

  @Prop()
  zipCode: string;

  @Prop()
  city: string;

  @Prop({ required: true })
  ownerId: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
