import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyDocument } from 'src/models/company.model';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel('Company')
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  findUserCompany(userId: string) {
    return this.companyModel.findOne({ ownerId: userId }).lean().exec();
  }

  async saveCompany(company: Partial<CompanyDocument>, ownerId: string) {
    await this.companyModel.findOneAndUpdate(
      { ownerId },
      { ...company, ownerId },
      { upsert: true },
    );

    return this.findUserCompany(ownerId);
  }
}
