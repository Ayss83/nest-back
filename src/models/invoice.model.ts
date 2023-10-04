import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductDocument } from './product.model';
import { Customer, CustomerDocument } from './customer.model';
import { Document } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema()
export class Invoice {
  @Prop({ unique: true })
  num: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true, type: Customer })
  customer: CustomerDocument;

  @Prop({ default: [] })
  products: { quantity: number; product: ProductDocument }[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
