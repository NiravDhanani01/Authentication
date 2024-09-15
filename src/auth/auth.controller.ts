import { Controller, Post, Body, Res, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/loginDto.dto';
import { Request, response, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/login')
  async login(
    @Body() login_data: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('log data', login_data);
    const { access_token, refresh_token } =
      await this.authService.login(login_data);
    response.cookie('access_token', access_token, { httpOnly: true });
    response.cookie('refresh_token', refresh_token, { httpOnly: true });

    return { access_token, refresh_token };
  }

  @Get('/user')
  getUser(@Req() request: Request) {
    const cookie = request.cookies['access_token'];
    return this.authService.getUser(cookie);
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return {
      message: 'success',
    };
  }
}
