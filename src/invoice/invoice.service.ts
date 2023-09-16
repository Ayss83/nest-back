import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvoiceDocument } from 'src/models/invoice.model';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel('Invoice')
    private readonly invoiceModel: Model<InvoiceDocument>,
  ) {}

  async findAllUserInvoices(userId: string) {
    return this.invoiceModel.find({ ownerId: userId }).exec();
  }
}
