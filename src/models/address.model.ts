import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Address {
  @Prop({ required: true })
  address: string;

  @Prop()
  address2: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop({ required: true })
  city: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
