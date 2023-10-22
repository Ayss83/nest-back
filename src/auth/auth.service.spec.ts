import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User, UserDetails } from 'src/models/user.model';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  const jwtService = { signAsync: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user and return user details', async () => {
      const newUser: User = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };

      const hashedPassword = await bcrypt.hash(newUser.password, 12);
      const createdUser: User = { ...newUser, password: hashedPassword };
      const userDetails: UserDetails = {
        id: 'test',
        name: createdUser.username,
        email: createdUser.email,
      };

      userService.createUser = jest.fn().mockResolvedValue(createdUser);
      userService.getUserDetails = jest.fn().mockReturnValue(userDetails);
      userService.findUserByEmail = jest.fn().mockResolvedValue(null);

      const result = await authService.signup(newUser);

      expect(result).toEqual(userDetails);
    });

    it('should return an error if user already exists', async () => {
      const existingUser: User = {
        username: 'existinguser',
        email: 'test@example.com',
        password: 'password',
      };

      userService.findUserByEmail = jest.fn().mockResolvedValue(existingUser);

      const newUser: User = {
        username: 'newuser',
        email: 'test@example.com',
        password: 'password',
      };

      const result = await authService.signup(newUser);

      expect(result).toEqual({
        error: 'There is already an account with this email address',
      });
    });
  });

  describe('login', () => {
    it('should return a JWT token if login credentials are valid', async () => {
      const credentials = { email: '', password: '' };
      const existingUser: UserDetails = {
        email: 'test',
        id: 'test',
        name: 'test',
      };
      const tokenResult = 'generated-jwt-token';

      authService.validateUser = jest.fn().mockResolvedValue(existingUser);

      authService.renewToken = jest
        .fn()
        .mockReturnValue({ token: tokenResult });

      const result = await authService.login(credentials);

      expect(result).toEqual({ token: tokenResult });
    });

    it('should return null if login credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'password';

      userService.findUserByEmail = jest.fn().mockResolvedValue(null);

      const credentials = { email, password };
      const result = await authService.login(credentials);

      expect(result).toBeNull();
    });
  });

  describe('renewToken', () => {
    it('should return a new JWT token', async () => {
      const user: UserDetails = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      };
      const expectedToken = 'mocked-jwt-token';
      jwtService.signAsync.mockResolvedValue(expectedToken);

      const result = await authService.renewToken(user);

      expect(jwtService.signAsync).toHaveBeenCalledWith({ user });
      expect(result).toEqual({ token: expectedToken });
    });
  });

  describe('validateUser', () => {
    it('should validate a user and return user details', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = {
        id: '1',
        name: 'Test User',
        email,
        password: 'hashedPassword',
      };

      authService.checkPasswordMatch = jest.fn().mockReturnValue(true);
      userService.findUserByEmail = jest.fn().mockResolvedValue(user);
      userService.getUserDetails = jest.fn().mockReturnValue({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      const result = await authService.validateUser(email, password);

      expect(userService.findUserByEmail).toHaveBeenCalledWith(
        email,
      );
      expect(userService.getUserDetails).toHaveBeenCalledWith(user);
      expect(result).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    });

    it('should return null when no user is found with the given email', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password';

      userService.findUserByEmail = jest.fn();

      const result = await authService.validateUser(email, password);

      expect(userService.findUserByEmail).toHaveBeenCalledWith(
        email,
      );
      expect(result).toBeNull();
    });

    it("should return null when the password doesn't match", async () => {
      const email = 'test@example.com';
      const password = 'incorrectPassword';
      const user = {
        id: '1',
        name: 'Test User',
        email,
        password: 'hashedPassword',
      };

      userService.findUserByEmail = jest.fn().mockResolvedValue(user);

      const result = await authService.validateUser(email, password);

      expect(userService.findUserByEmail).toHaveBeenCalledWith(
        email,
      );
      expect(result).toBeNull();
    });
  });
});
