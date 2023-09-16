import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema()
export class Invoice {
  @Prop({ required: true, unique: true })
  num: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  ownerId: string;

  @Prop({default: []})
  products: any[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
