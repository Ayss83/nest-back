import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // kept as testing endpoint to check that app is running
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
