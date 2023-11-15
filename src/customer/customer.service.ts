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

  findAllUserCustomers(userId: string) {
    return this.customerModel.find({ ownerId: userId }).lean().exec();
  }

  /**
   * Creates a new customer entry in database or updates if it's an existing one.
   * 
   * @param customer Customer data to save
   * @param ownerId Requesting user's id
   * @returns Saved customer
   */
  async saveCustomer(customer: Partial<CustomerDocument>, ownerId: string) {
    if (!customer.num) {
      return this.customerModel.create({ ...customer, ownerId });
    } else {
      await this.customerModel.findOneAndUpdate(
        { num: customer.num },
        { ...customer, ownerId }
      );

      return this.customerModel.findOne({num: customer.num});
    }
  }

  /**
   * Finds a customer based on its id in customers belonging to user and deletes it.
   * 
   * @param customerId Id of customer to delete
   * @param ownerId Requesting user's id
   * @returns Customer that's been deleted or null
   */
  async deleteCustomer(customerId: string, ownerId: string) {
    const customer = await this.customerModel.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(customerId) }, { ownerId }],
    });

    if (customer) {
      return this.customerModel.findByIdAndDelete(customerId);
    }
  }
}
