import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

describe('CustomerController', () => {
  let controller: CustomerController;
  const mockCustomersList = [{}, {}, {}];
  const mockCustomer = { lastName: 'test' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CustomerService,
          useValue: {
            findAllUserCustomers: jest
              .fn()
              .mockResolvedValue(mockCustomersList),
            saveCustomer: jest
              .fn()
              .mockImplementation((customer, _id) => customer),
            deleteCustomer: jest.fn(),
          },
        },
      ],
      controllers: [CustomerController],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCustomers', () => {
    it('should return customers list', async () => {
      const result = await controller.getAllCustomers({
        user: { id: 'mockUserId' },
      });

      expect(
        controller['customerService'].findAllUserCustomers,
      ).toHaveBeenCalledWith('mockUserId');
      expect(result).toBe(mockCustomersList);
    });
  });

  describe('saveCustomer', () => {
    it('should return customer', async () => {
      const result = await controller.saveCustomer({
        body: mockCustomer,
        user: { id: 'mockUserId' },
      });

      expect(controller['customerService'].saveCustomer).toHaveBeenCalledWith(
        mockCustomer,
        'mockUserId',
      );
      expect(result).toBe(mockCustomer);
    });
  });

  describe('deleteCustomer', () => {
    it('should request customer deletion', async () => {
      await controller.deleteCustomer('customerId', {
        user: { id: 'mockUserId' },
      });

      expect(controller['customerService'].deleteCustomer).toHaveBeenCalledWith(
        'customerId',
        'mockUserId',
      );
    });
  });
});
