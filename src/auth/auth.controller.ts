import { Controller, Post, Body, Res, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/loginDto.dto';
import { request, Request, response, Response } from 'express';

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
    response.cookie('access_token', access_token, {
      httpOnly: true,
    });
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
    });

    return { message: 'Logged in successfully' };
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token']; // Get refresh token from cookies

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }
  
    const user_data = await this.authService.verifyRefreshToken(refreshToken);
    
    // Generate a new access token
    const new_access_token = await this.authService.generateAccessToken(user_data.sub);
  
    // Set new access token in the cookie
    response.cookie('access_token', new_access_token, { httpOnly: true });
  
    return { access_token: new_access_token };
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
      message: 'Logged out successfully',
    };
  }
}
