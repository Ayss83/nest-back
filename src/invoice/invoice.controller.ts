import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('invoice')
export class InvoiceController {

  constructor(private invoiceService: InvoiceService) {}

  @UseGuards(JwtGuard)
  @Get('')
  getAllInvoices(@Request() req) {
    return this.invoiceService.findAllUserInvoices(req.user.id);
  }
}
