import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InvoiceController } from './invoice/invoice.controller';
import { InvoiceModule } from './invoice/invoice.module';
import { ProductModule } from './product/product.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/invoicer'),
    AuthModule,
    UserModule,
    InvoiceModule,
    ProductModule,
    CustomerModule,
  ],
  controllers: [AppController, InvoiceController],
  providers: [AppService],
})
export class AppModule {}
