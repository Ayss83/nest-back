import { Controller, Get, UseGuards, Request, Post, Delete, Param } from '@nestjs/common';
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

  @UseGuards(JwtGuard)
  @Post('')
  saveInvoice(@Request() req) {
    return this.invoiceService.saveInvoice(req.body, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteInvoice(@Param('id') id: string, @Request() req) {
    return this.invoiceService.deleteInvoice(id, req.user.id);
  }
}
