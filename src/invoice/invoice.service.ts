import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CustomerService } from 'src/customer/customer.service';
import { InvoiceDocument } from 'src/models/invoice.model';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel('Invoice')
    private readonly invoiceModel: Model<InvoiceDocument>,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
  ) {}

  async findAllUserInvoices(userId: string) {
    return this.invoiceModel.find({ ownerId: userId }).exec();
  }

  async saveInvoice(invoice: Partial<InvoiceDocument>, ownerId: string) {
    this.customerService.saveCustomer(invoice.customer, ownerId);
    invoice.products.forEach((quantityProduct) => {
      this.productService.saveProduct(quantityProduct.product, ownerId);
    });
    if (!invoice.num) {
      return this.invoiceModel.create({ ...invoice, ownerId });
    } else {
      return this.invoiceModel.findOneAndUpdate(
        { num: invoice.num },
        { ...invoice, ownerId },
      );
    }
  }

  async deleteInvoice(invoiceId: string, ownerId: string) {
    const invoice = await this.invoiceModel.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(invoiceId) }, { ownerId }],
    });

    if (invoice) {
      return this.invoiceModel.findByIdAndDelete(invoiceId);
    }
  }
}
