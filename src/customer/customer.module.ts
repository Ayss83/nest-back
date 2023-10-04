import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { CustomerSchema } from 'src/models/customer.model';
import { AutoIncrementID, AutoIncrementIDOptions } from '@typegoose/auto-increment';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Customer',
        useFactory: async () => {
          const schema = CustomerSchema;

          schema.plugin(AutoIncrementID, {
            field: 'num',
            startAt: 1,
          } satisfies AutoIncrementIDOptions);

          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
