import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserDetails } from 'src/models/user.model';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  const token = 'your-jwt-token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      controllers: [AuthController],
      providers: [AuthService, { provide: UserService, useValue: {} }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should create a new user and return UserDetails', async () => {
      const user: User = {
        username: 'test',
        email: 'test@example.com',
        password: 'password',
      };
      const userDetails: UserDetails = {
        id: 'test',
        name: 'test',
        email: 'test',
      };
      jest.spyOn(authService, 'signup').mockResolvedValue(userDetails);

      const result = await authController.signup(user);

      expect(result).toBe(userDetails);
    });
  });

  describe('login', () => {
    it('should return a JWT token when user logs in', async () => {
      const user = { email: 'test@example.com', password: 'password' };
      jest.spyOn(authService, 'login').mockResolvedValue({ token });

      const result = await authController.login(user);

      expect(result).toEqual({ token });
    });
  });

  describe('renewToken', () => {
    it('should renew the token for an authenticated user', async () => {
      const user: User = {
        username: 'test',
        email: 'test@example.com',
        password: 'password',
      };
      const renewedToken = 'your-renewed-jwt-token';
      jest
        .spyOn(authService, 'renewToken')
        .mockResolvedValue({ token: renewedToken });

      const result = await authController.renewToken({ user });

      expect(result).toEqual({ token: renewedToken });
    });
  });
});
