import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  const mockInvoiceList = [{}, {}];
  const mockUserId = 'mockUserId';
  const mockInvoice = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: InvoiceService,
          useValue: {
            findAllUserInvoices: jest.fn().mockResolvedValue(mockInvoiceList),
            saveInvoice: jest
              .fn()
              .mockImplementation((invoice, _id) => invoice),
            deleteInvoice: jest.fn(),
          },
        },
      ],
      controllers: [InvoiceController],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllInvoices', () => {
    it('should return list of invoices', async () => {
      const result = await controller.getAllInvoices({
        user: { id: mockUserId },
      });

      expect(
        controller['invoiceService'].findAllUserInvoices,
      ).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(mockInvoiceList);
    });
  });

  describe('saveInvoice', () => {
    it('should return invoice', () => {
      const result = controller.saveInvoice({
        body: mockInvoice,
        user: { id: mockUserId },
      });

      expect(controller['invoiceService'].saveInvoice).toHaveBeenCalledWith(
        mockInvoice,
        mockUserId,
      );
      expect(result).toBe(mockInvoice);
    });
  });

  describe('deleteInvoice', () => {
    it('should request invoice deletion', () => {
      controller.deleteInvoice('invoiceId', { user: { id: mockUserId } });

      expect(controller['invoiceService'].deleteInvoice).toHaveBeenCalledWith(
        'invoiceId',
        mockUserId,
      );
    });
  });
});
