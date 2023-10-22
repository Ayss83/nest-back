import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getModelToken } from '@nestjs/mongoose';

describe('ProductService', () => {
  let service: ProductService;
  const mockProductList = [{}];
  const mockProduct = {};
  const mockNewProduct = {};
  const mockUserId = 'mockUserId';
  const mockProductId = '651017b6ad9ee5e811c5acb7';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken('Product'),
          useValue: {
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            findById: jest.fn(),
            find: jest.fn().mockReturnValue({
              lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockReturnValue(mockProductList),
              }),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllUserProducts', () => {
    it('should return products list', () => {
      const result = service.findAllUserProducts(mockUserId);

      expect(service['productModel'].find).toHaveBeenCalledWith({
        ownerId: mockUserId,
      });
      expect(result).toBe(mockProductList);
    });
  });

  describe('saveProduct', () => {
    it('should upsert a product', () => {
      service.saveProduct(mockProduct, mockUserId);

      expect(service['productModel'].findOneAndUpdate).toHaveBeenCalledWith(
        {
          _id: expect.any(Object),
        },
        { ...mockProduct, ownerId: mockUserId },
        { upsert: true },
      );
    });

    it('should return upserted product', async () => {
      service['productModel'].findById = jest
        .fn()
        .mockReturnValue(mockNewProduct);

      const result = await service.saveProduct(mockProduct, mockUserId);

      expect(service['productModel'].findById).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockNewProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should request product deletion', async () => {
      service['productModel'].findOne = jest
        .fn()
        .mockResolvedValue(mockProduct);

      await service.deleteProduct(mockProductId, mockUserId);

      expect(service['productModel'].findByIdAndDelete).toHaveBeenCalledWith(
        mockProductId,
      );
    });
  });
});
