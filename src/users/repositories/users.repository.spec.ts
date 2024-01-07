import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../repositories/users.repository';
import { User, UserDocument } from '../../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserDto } from '../../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

describe('UsersController', () => {
  let usersRepository: UsersRepository;
  let userModel: mongoose.Model<UserDocument>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    usersRepository = app.get<UsersRepository>(UsersRepository);
    userModel = app.get(getModelToken(User.name));
  });

  describe('getUser', () => {
    const email = 'test@email.com';
    const password = 'passwordtest2@';

    it('Should call findOne of userModel with correct data', () => {
      // Arrange
      const result: UserDocument = {
        _id: 'someId',
        name: 'John',
        email: 'test@email.com',
        password: 'passwordtest2@',
      } as unknown as UserDocument;
      userModel.findOne = jest.fn().mockResolvedValue(result);
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      // Act
      usersRepository.getUserByEmail(email, password);

      // Assert
      expect(userModel.findOne).toBeCalledWith({ email });
    });

    it('Should return a user', async () => {
      // Arrange
      const result: UserDocument = {
        _id: 'someId',
        name: 'John',
        email: 'test@email.com',
        password: 'passwordtest2@',
      } as unknown as UserDocument;
      userModel.findOne = jest.fn().mockResolvedValue(result);
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      // Act
      const response = await usersRepository.getUserByEmail(email, password);

      // Assert
      expect(response).toEqual(result);
    });

    it("Should throw an error if passwords don't match", async () => {
      // Arrange
      const result: UserDocument = {
        _id: 'someId',
        name: 'John',
        email: 'test@email.com',
        password: 'passwordtest2@',
      } as unknown as UserDocument;
      userModel.findOne = jest.fn().mockResolvedValue(result);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      // Act & Assert
      await expect(
        usersRepository.getUserByEmail(email, password),
      ).rejects.toThrow('Wrong password.');
    });

    describe('createUser', () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        email: 'test@email.com',
        password: 'passwordtest2@',
      };

      it('Should call createUser of usersRepository with correct data inside it', async () => {
        // Arrange
        const params = {
          name: 'John',
          email: 'test@email.com',
          password: 'hashedPassword',
        };

        const result: UserDocument = {
          _id: 'someId',
          name: 'John',
          email: 'test@email.com',
          password: 'passwordtest2@',
        } as unknown as UserDocument;

        userModel.create = jest.fn().mockResolvedValue(result);
        bcrypt.hash = jest.fn().mockResolvedValue(params.password);

        // Act
        await usersRepository.createUser(createUserDto);

        // Assert
        expect(userModel.create).toBeCalledWith(params); // Ensure that create is called with the correct data
      });

      it('Should return the user created', async () => {
        // Arrange
        const params = {
          name: 'John',
          email: 'test@email.com',
          password: 'hashedPassword',
        };

        const result: UserDocument = {
          _id: 'someId',
          name: 'John',
          email: 'test@email.com',
          password: 'passwordtest2@',
        } as unknown as UserDocument;

        userModel.create = jest.fn().mockResolvedValue(result);
        bcrypt.hash = jest.fn().mockResolvedValue(params.password);

        // Act
        const user = await usersRepository.createUser(createUserDto);

        // Assert
        expect(user).toEqual(result); // Ensure that create is called with the correct data
      });

      it('Should throw an error if userModel.create throws it', async () => {
        // Arrange

        userModel.create = jest.fn().mockResolvedValue(() => {
          throw new Error('Simulate error');
        });
        bcrypt.hash = jest.fn().mockResolvedValue('params.password');

        // Act & Assert
        await expect(
          usersRepository.createUser(createUserDto),
        ).resolves.toThrow(); // Ensure that create is called with the correct data
      });

      afterEach(() => {
        // Restore the original implementation after each test
        jest.restoreAllMocks();
      });
    });
  });
});
