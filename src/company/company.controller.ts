import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {

  constructor(private companyService: CompanyService) {}

  @UseGuards(JwtGuard)
  @Get('')
  getCompany(@Request() req) {
    return this.companyService.findUserCompany(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post('')
  saveCompany(@Request() req) {
    return this.companyService.saveCompany(req.body, req.user.id);
  }
}
