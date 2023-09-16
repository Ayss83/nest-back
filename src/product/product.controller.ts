import { Controller, Get, UseGuards, Request } from '@nestjs/common';
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
}
