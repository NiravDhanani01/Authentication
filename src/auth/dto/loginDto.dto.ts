import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({
    description: 'User Email',
    required: true,
  })
  user_email: string;

  @IsString()
  @ApiProperty({
    description: 'User Password',
    required: true,
  })
  user_password: string;
}
