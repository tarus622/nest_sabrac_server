import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
