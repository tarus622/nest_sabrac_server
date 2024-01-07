import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { GetUserDto } from '../../dtos/get-user.dto';

@Injectable()
export class UsersService {
  constructor(public repo: UsersRepository) {}

  async getUser(getUserDto: GetUserDto) {
    try {
      return this.repo.getUserByEmail(getUserDto.email, getUserDto.password);
    } catch (error) {
      throw error;
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      return this.repo.createUser(createUserDto);
    } catch (error) {
      throw error;
    }
  }
}
