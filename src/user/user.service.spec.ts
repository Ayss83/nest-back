import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';

describe('UserService', () => {
  let service: UserService;
  const mockUsername = 'testUsername';
  const mockEmail = 'testEmail';
  const mockHashedPassword = 'testPassword';
  const mockUser = {};
  const mockUserDetails = {};
  const mockUserId = 'mockUserId';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {
            findOne: jest.fn().mockReturnValue({
              lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockReturnValue(mockUser),
              }),
            }),
            findById: jest.fn().mockReturnValue({
              lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockReturnValue(mockUser),
              }),
            }),
            create: jest.fn().mockReturnValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should save the user', async () => {
      const result = await service.createUser(
        mockUsername,
        mockEmail,
        mockHashedPassword,
      );

      expect(result).toBe(mockUser);
    });
  });

  describe('findUserByUsername', () => {
    it('should return user found with username', async () => {
      const result = await service.findUserByUsername(mockUsername);

      expect(service['userModel'].findOne).toHaveBeenCalledWith({
        username: mockUsername,
      });

      expect(result).toBe(mockUser);
    });
  });

  describe('findUserByEmail', () => {
    it('should return user found with email', async () => {
      const result = await service.findUserByEmail(mockEmail);

      expect(service['userModel'].findOne).toHaveBeenCalledWith({
        email: mockEmail,
      });

      expect(result).toBe(mockUser);
    });
  });

  describe('findUserbyId', () => {
    it('should return user details', async () => {
      service.getUserDetails = jest.fn().mockReturnValue(mockUserDetails);

      const result = await service.findUserById(mockUserId);

      expect(service['userModel'].findById).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(mockUserDetails);
    });

    it('should return null', async () => {
      service['userModel'].findById = jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue(undefined),
        }),
      });

      const result = await service.findUserById(mockUserId);

      expect(result).toBeNull();
    });
  });

  describe('getUserDetails', () => {
    it('should return user without password', () => {
      const user = {
        _id: 'testId',
        username: 'testusername',
        email: 'testemail',
        password: 'testpassword',
      } as any;

      expect(service.getUserDetails(user)).toEqual({
        id: 'testId',
        name: 'testusername',
        email: 'testemail',
      });
    });
  });
});
