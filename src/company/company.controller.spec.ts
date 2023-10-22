import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

describe('CompanyController', () => {
  let controller: CompanyController;
  let companyService: CompanyService;

  const mockCompany = {
    _id: 'mockId',
    registrationNumber: '123456',
    name: 'Mock Company',
    email: 'mock@example.com',
    phone: '123-456-7890',
    address: 'Mock Address',
    address2: 'Apt 123',
    zipCode: '12345',
    city: 'Mock City',
    ownerId: 'owner123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CompanyService,
          useValue: {
            findUserCompany: jest.fn().mockResolvedValue(mockCompany),
            saveCompany: jest.fn().mockResolvedValue(mockCompany),
          },
        },
      ],
      controllers: [CompanyController],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    companyService = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCompany', () => {
    it('should return the company', async () => {
      const result = await controller.getCompany({
        user: { id: 'mockUserId' },
      });

      expect(controller['companyService'].findUserCompany).toHaveBeenCalledWith(
        'mockUserId',
      );
      expect(result).toBe(mockCompany);
    });
  });

  describe('saveCompany', () => {
    it('should return the company', async () => {
      const result = await controller.saveCompany({
        body: mockCompany,
        user: { id: 'mockUserId' },
      });

      expect(controller['companyService'].saveCompany).toHaveBeenCalledWith(
        mockCompany,
        'mockUserId',
      );
      expect(result).toBe(mockCompany);
    });
  });
});
