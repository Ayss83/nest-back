import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @UseGuards(JwtGuard)
  @Get('')
  getAllCustomers(@Request() req) {
    return this.customerService.findAllUserCustomers(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post('')
  saveCustomer(@Request() req) {
    return this.customerService.saveCustomer(req.body, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteCustomer(@Param('id') id: string, @Request() req) {
    return this.customerService.deleteCustomer(id, req.user.id);
  }
}
