import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { InvoiceSchema } from 'src/models/invoice.model';
import { CustomerModule } from 'src/customer/customer.module';
import { ProductModule } from 'src/product/product.module';
import {
  AutoIncrementID,
  AutoIncrementIDOptions,
} from '@typegoose/auto-increment';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Invoice',
        useFactory: async () => {
          const schema = InvoiceSchema;

          schema.plugin(AutoIncrementID, {
            field: 'num',
            startAt: 1,
          } satisfies AutoIncrementIDOptions);

          return schema;
        },
        inject: [getConnectionToken()]
      },
    ]),
    CustomerModule,
    ProductModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
