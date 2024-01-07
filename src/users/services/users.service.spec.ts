import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from '../repositories/users.repository';
import { User, UserDocument } from '../../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('UsersController', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
      ],
    }).compile();

    usersService = app.get<UsersService>(UsersService);
    usersRepository = app.get<UsersRepository>(UsersRepository);

    // Mock userRepository funcions
    usersRepository.getUserByEmail = jest.fn();
    usersRepository.createUser = jest.fn();
  });

  describe('getUser', () => {
    const body: { email: string; password: string } = {
      email: 'test@email.com',
      password: 'passwordtest2@',
    };
    it('Should call getUserByEmail of userRepository with correct data', () => {
      // Act
      usersService.getUser(body);

      // Assert
      expect(usersRepository.getUserByEmail).toBeCalledWith(
        body.email,
        body.password,
      );
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
        .spyOn(usersRepository, 'getUserByEmail')
        .mockImplementation(() => Promise.resolve(result));

      // Act
      const response = await usersService.getUser(body);

      // Assert
      expect(response).toEqual(result);
    });

    it('Should throw an error if userRepository.getUserByEmail throws it', async () => {
      // Arrange
      // Mocking userService.getUser to throw an error
      jest.spyOn(usersRepository, 'getUserByEmail').mockImplementation(() => {
        throw new Error('Simulated error');
      });

      // Act & Assert
      await expect(async () => {
        await usersRepository.getUserByEmail(body.email, body.password);
      }).rejects.toThrow('Simulated error');
    });
  });

  describe('createUser', () => {
    const body: { name: string; email: string; password: string } = {
      name: 'test',
      email: 'test@email.com',
      password: 'passwordtest2@',
    };

    it('Should call createUser of usersRepository with correct data inside it', () => {
      // Act
      usersService.createUser(body);

      // Assert
      expect(usersRepository.createUser).toBeCalledWith(body);
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
      const response = await usersService.createUser(body);

      // Assert
      expect(response).toEqual(result);
    });

    it('Should throw an error if userRepository.createUser throws it', async () => {
      // Arrange
      // Mocking userService.createUser to throw an error
      jest.spyOn(usersRepository, 'createUser').mockImplementation(() => {
        throw new Error('Simulated error');
      });

      // Act & Assert
      await expect(async () => {
        await usersService.createUser(body);
      }).rejects.toThrow('Simulated error');
    });
  });
});
