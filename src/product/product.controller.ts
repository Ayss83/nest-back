import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(JwtGuard)
  @Get('')
  getAllProducts(@Request() req) {
    return this.productService.findAllUserProducts(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post('')
  saveProduct(@Request() req) {
    return this.productService.saveProduct(req.body, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteProduct(@Param('id') id: string, @Request() req) {
    return this.productService.deleteProduct(id, req.user.id);
  }
}
