import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(4)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(7)
  @Matches(/[0123456789]/)
  password: string;
}
