import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { UsersRepository } from '../repositories/users.repository';
import { User, UserDocument } from '../../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        UsersRepository,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(UsersService);

    // Mock userService funcions
    usersService.getUser = jest.fn();
    usersService.createUser = jest.fn();
  });
  describe('getUser', () => {
    const body: { email: string; password: string } = {
      email: 'test@email.com',
      password: 'passwordtest2@',
    };

    it('Should call getUser of usersService with correct data inside it', () => {
      // Act
      usersController.getUser(body);

      // Assert
      expect(usersService.getUser).toBeCalledWith(body);
    });

    it('Should return a user', async () => {
      // Arrange
      const result: UserDocument = {
        _id: 'someId',
        name: 'John',
        email: 'john@example.com',
        password: 'password',
      } as unknown as UserDocument;

      // Mocking the implementation of getUser
      jest
        .spyOn(usersService, 'getUser')
        .mockImplementation(() => Promise.resolve(result));

      // Act
      const response = await usersController.getUser(body);

      // Assert
      expect(response).toEqual(result);
    });

    it('Should throw an error if userService.getUser throws it', async () => {
      // Arrange
      // Mocking userService.getUser to throw an error
      jest.spyOn(usersService, 'getUser').mockImplementation(() => {
        throw new Error('Simulated error');
      });

      // Act & Assert
      await expect(async () => {
        await usersController.getUser(body);
      }).rejects.toThrow('Simulated error');
    });
  });

  describe('createUser', () => {
    const body: { name: string; email: string; password: string } = {
      name: 'test',
      email: 'test@email.com',
      password: 'passwordtest2@',
    };

    it('Should call createUser of usersService with correct data inside it', () => {
      // Act
      usersController.createUser(body);

      // Assert
      expect(usersService.createUser).toBeCalledWith(body);
    });

    it('Should return the user created', async () => {
      // Arrange
      const result: UserDocument = {
        _id: 'someId',
        name: body.name,
        email: body.email,
        password: body.password,
      } as unknown as UserDocument;
      jest
        .spyOn(usersService, 'createUser')
        .mockImplementation(() => Promise.resolve(result));

      // Act
      const response = await usersController.createUser(body);

      // Assert
      expect(response).toEqual(result);
    });

    it('Should throw an error if userService.createUser throws it', async () => {
      // Arrange
      // Mocking userService.createUser to throw an error
      jest.spyOn(usersService, 'createUser').mockImplementation(() => {
        throw new Error('Simulated error');
      });

      // Act & Assert
      await expect(async () => {
        await usersController.createUser(body);
      }).rejects.toThrow('Simulated error');
    });
  });

  afterEach(() => {
    // Restore the original implementation after each test
    jest.restoreAllMocks();
  });
});
