import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  const mockUser = {};
  const mockId = 'testId';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: { findUserById: jest.fn().mockReturnValue(mockUser) },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should return user', () => {
      const result = controller.getUser(mockId);

      expect(controller['userService'].findUserById).toHaveBeenCalledWith(
        mockId,
      );
      expect(result).toBe(mockUser);
    });
  });
});
