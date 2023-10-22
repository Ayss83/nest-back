import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { getModelToken } from '@nestjs/mongoose';

describe('CustomerService', () => {
  let service: CustomerService;
  const mockCustomerList = [{}];
  const mockCustomer = {};
  const mockExistingCustomer = { num: 123456 };
  const mockUserId = 'mockUserId';
  const mockCustomerId = '651017b6ad9ee5e811c5acb7';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getModelToken('Customer'),
          useValue: {
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            findByIdAndDelete: jest.fn(),
            find: jest.fn().mockReturnValue({
              lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockReturnValue(mockCustomerList),
              }),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllUserCustomers', () => {
    it('should return customers list', () => {
      const result = service.findAllUserCustomers(mockUserId);

      expect(service['customerModel'].find).toHaveBeenCalledWith({
        ownerId: mockUserId,
      });
      expect(result).toBe(mockCustomerList);
    });
  });

  describe('saveCustomer', () => {
    it('should create a new customer', () => {
      service.saveCustomer(mockCustomer, mockUserId);

      expect(service['customerModel'].create).toHaveBeenCalledWith({
        ...mockCustomer,
        ownerId: mockUserId,
      });
    });

    it('should update a customer', () => {
      service.saveCustomer(mockExistingCustomer, mockUserId);

      expect(service['customerModel'].findOneAndUpdate).toHaveBeenCalledWith(
        { num: mockExistingCustomer.num },
        { ...mockExistingCustomer, ownerId: mockUserId },
      );
    });

    it('should return updated customer', async () => {
      await service.saveCustomer(mockExistingCustomer, mockUserId);

      expect(service['customerModel'].findOne).toHaveBeenCalledWith({
        num: mockExistingCustomer.num,
      });
    });
  });

  describe('deleteCustomer', () => {
    it('should request customer deletion', async () => {
      service['customerModel'].findOne = jest
        .fn()
        .mockResolvedValue(mockCustomer);

      await service.deleteCustomer(mockCustomerId, mockUserId);

      expect(service['customerModel'].findByIdAndDelete).toHaveBeenCalledWith(
        mockCustomerId,
      );
    });
  });
});
