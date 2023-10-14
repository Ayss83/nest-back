import { Controller, Post, Body, Request } from '@nestjs/common';
import { Get, HttpCode, UseGuards } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { User, UserDetails } from 'src/models/user.model';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() user: User): Promise<UserDetails | null> {
    return this.authService.signup(user) as Promise<UserDetails>;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() user: { email: string; password: string },
  ): Promise<{ token: string } | null> {
    return this.authService.login(user);
  }

  @UseGuards(JwtGuard)
  @Get('token')
  renewToken(@Request() req) {
    return this.authService.renewToken(req.user);
  }
}
