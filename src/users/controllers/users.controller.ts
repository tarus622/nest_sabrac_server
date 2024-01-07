import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { GetUserDto } from '../../dtos/get-user.dto';
import { CreateUserDto } from '../../dtos/create-user.dto';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/find')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async getUser(@Body() getUserDto: GetUserDto) {
    try {
      return await this.usersService.getUser(getUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      throw error;
    }
  }
}
