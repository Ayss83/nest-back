import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CustomerDocument } from 'src/models/customer.model';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer')
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async findAllUserCustomers(userId: string) {
    return this.customerModel.find({ ownerId: userId }).lean().exec();
  }

  async saveCustomer(customer: Partial<CustomerDocument>, ownerId: string) {
    return this.customerModel.findOneAndUpdate(
      { _id: customer._id ?? new mongoose.Types.ObjectId() },
      { ...customer, ownerId },
      { upsert: true },
    );
  }

  async deleteCustomer(customerId: string, ownerId: string) {
    const customer = await this.customerModel.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(customerId) }, { ownerId }],
    });

    if (customer) {
      return this.customerModel.findByIdAndDelete(customerId);
    }
  }
}
