import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAuthDto {
  id: number;

  @IsString()
  @ApiProperty({
    description: 'Full Name',
    required: true,
  })
  full_name: string;

  @IsString()
  @ApiProperty({
    description: 'Unique User Name',
    required: true,
  })
  user_name: string;

  @IsString()
  @ApiProperty({
    description: 'User Phone Number',
    required: true,
  })
  user_phone: string;

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
