import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/loginDto.dto';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const user = new Users();
    const saltRounds =
      +this.configService.get<string>('BCRYPT_SALT_ROUNDS') || 10; // Fallback to default if not set
    const hash = await bcrypt.hash(createAuthDto.user_password, saltRounds);
    user.full_name = createAuthDto.full_name;
    user.user_name = createAuthDto.user_name;
    user.user_email = createAuthDto.user_email;
    user.user_phone = createAuthDto.user_phone;
    user.user_password = hash;

    return await this.userRepository.save(user);
  }

  async login(login_data: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { user_email: login_data.user_email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid Email');
    }

    const isValidPassword = await bcrypt.compare(
      login_data.user_password,
      user.user_password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid Password');
    }

    const payload = { sub: user.id };
    const access_token = await this.jwtService.signAsync(payload, {
      secret : this.configService.get<string>('JWT_ACC_SECRET'),
      expiresIn: '1m',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret : this.configService.get<string>('JWT_REF_SECRET'),
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  async getUser(cookie) {
    const user_data = await this.jwtService.verifyAsync(cookie);
    console.log(user_data);
    if (!user_data) {
      throw new UnauthorizedException();
    }
    let id = user_data.sub;
    const user = await this.userRepository.findOneBy({ id });
    const { user_password, ...result } = user;
    return result;
  }


  
  async verifyRefreshToken(token: string) {
    try {
      // Verify the refresh token
      const user_data = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REF_SECRET'),
      });
      return user_data;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  
  async generateAccessToken(userId: number) {
    const payload = { sub: userId };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACC_SECRET'),
      expiresIn: '1h', // Short expiry for access token
    });
    return access_token;
  }
  
}



