import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/loginDto.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

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
    const { access_token, refresh_token } =
      await this.authService.login(login_data);
    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
    });
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
    });

    return { message: 'Logged in successfully' };
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refresh_token = await request.cookies['refresh_token'];
    if (!refresh_token) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const user_new_token =
      await this.authService.verifyRefreshToken(refresh_token);

    response.cookie('access_token', user_new_token, {
      httpOnly: true,
      secure: true,
    });

    return {
      message: ' New Access Token ',
    };
  }

  // @UseGuards(AuthGuard)
  @Get('/user')
  getUser(@Req() request: Request) {
    const cookie = request.cookies['access_token'];
    if (!cookie) {
      throw new UnauthorizedException('No access token found');
    }
    return this.authService.getUser(cookie);
  }

  // @UseGuards(AuthGuard)
  @Post('/logout')
  logout(@Res({ passthrough: true }) response: Response,@Req() request:Request) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    const cookie = request.cookies['access_token'];
    
    this.authService.delete_token(cookie);
    return {
      message: 'Logged out successfully',
    };
  }

  // @UseGuards(AuthGuard)
  @Get()
  getHello(): string {
    return 'hello';
  }
}
