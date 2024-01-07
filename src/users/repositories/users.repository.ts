import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserByEmail(email: string, password: string) {
    try {
      const user = await this.userModel.findOne({ email });

      if (user === null) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error('Wrong password.');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { name, email, password } = createUserDto;

      const hashPassword = await bcrypt.hash(password, 10);

      const createdUser = await this.userModel.create({
        name,
        email,
        password: hashPassword,
      });

      return createdUser;
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error (unique constraint violation)
        throw new HttpException(
          'Email address is already in use',
          HttpStatus.CONFLICT,
        );
      } else {
        // Other errors
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
