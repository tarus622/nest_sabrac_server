import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { User, UserSchema } from '../schemas/user.schema';

const options = {
  path: `.${process.env.NODE_ENV || 'development'}.env`,
};

dotenv.config(options);

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? process.env.DB_CONNECTION_STRING_PROD
        : process.env.DB_CONNECTION_STRING_DEV,
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
