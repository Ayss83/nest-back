import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { getModelToken } from '@nestjs/mongoose';
import { CustomerService } from 'src/customer/customer.service';
import { ProductService } from 'src/product/product.service';

describe('InvoiceService', () => {
  let service: InvoiceService;
  const mockInvoiceList = [{}, {}, {}];
  const mockUserId = 'mockUserId';
  const mockInvoice = {
    products: [
      { quantity: 1, product: { name: 'product1' } },
      { quantity: 1, product: { name: 'product2' } },
    ],
  } as any;
  const mockExistingInvoice = { num: 123, products: [] };
  const mockInvoiceId = '651017b6ad9ee5e811c5acb7';
  const mockNewCustomer = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken('Invoice'),
          useValue: {
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            findByIdAndDelete: jest.fn(),
            find: jest.fn().mockReturnValue({
              lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockReturnValue(mockInvoiceList),
              }),
            }),
          },
        },
        { provide: CustomerService, useValue: { saveCustomer: jest.fn() } },
        {
          provide: ProductService,
          useValue: {
            saveProduct: jest
              .fn()
              .mockImplementation((product, userId) => product),
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllUserInvoices', () => {
    it('should return user invoices list', () => {
      const result = service.findAllUserInvoices(mockUserId);

      expect(service['invoiceModel'].find).toHaveBeenCalledWith({
        ownerId: mockUserId,
      });

      expect(result).toBe(mockInvoiceList);
    });
  });

  describe('saveInvoice', () => {
    it('should create a new invoice', async () => {
      await service.saveInvoice(mockInvoice, mockUserId);

      expect(service['invoiceModel'].create).toHaveBeenCalledWith({
        ...mockInvoice,
        ownerId: mockUserId,
      });
    });

    it('should update an invoice', async () => {
      await service.saveInvoice(mockExistingInvoice, mockUserId);

      expect(service['invoiceModel'].findOneAndUpdate).toHaveBeenCalledWith(
        { num: mockExistingInvoice.num },
        { ...mockExistingInvoice, ownerId: mockUserId },
      );
    });

    it('should save and update invoice customer', async () => {
      service['customerService'].saveCustomer = jest
        .fn()
        .mockResolvedValue(mockNewCustomer);
      service['invoiceModel'].create = jest
        .fn()
        .mockImplementation((invoice) => invoice);

      const result = await service.saveInvoice(mockInvoice, mockUserId);

      expect(result.customer).toBe(mockNewCustomer);
    });

    it('should save and update invoice products', async () => {
      // mocking a change to product to be able to assert it
      service['productService'].saveProduct = jest
        .fn()
        .mockImplementation((product, _ownerId) =>
          Promise.resolve({
            ...product,
            test: 'test',
          }),
        );

      service['invoiceModel'].create = jest
        .fn()
        .mockImplementation((invoice) => invoice);

      const result = await service.saveInvoice(mockInvoice, mockUserId);

      expect(service['productService'].saveProduct).toHaveBeenCalledTimes(2);
      result.products.forEach((product, index) => {
        expect(product.product).toEqual({
          ...mockInvoice.products[index].product,
          test: 'test',
        });
      });
    });
  });

  describe('deleteInvoice', () => {
    it('should request invoice deletion', async () => {
      service['invoiceModel'].findOne = jest
        .fn()
        .mockResolvedValue(mockInvoice);

      await service.deleteInvoice(mockInvoiceId, mockUserId);

      expect(service['invoiceModel'].findByIdAndDelete).toHaveBeenCalledWith(
        mockInvoiceId,
      );
    });
  });
});
