import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ProductDocument } from 'src/models/product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  findAllUserProducts(userId: string) {
    return this.productModel.find({ ownerId: userId }).lean().exec();
  }

  async saveProduct(product: Partial<ProductDocument>, ownerId: string) {
    const id = product._id ?? new mongoose.Types.ObjectId();
    await this.productModel
      .findOneAndUpdate(
        { _id: id },
        { ...product, ownerId },
        { upsert: true },
      );

    return this.productModel.findById(id);
  }

  async deleteProduct(productId: string, ownerId: string) {
    // looking for product with product id and owned by requesting user
    const product = await this.productModel.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(productId) }, { ownerId }],
    });

    if (product) {
      return this.productModel.findByIdAndDelete(productId);
    }
  }
}
