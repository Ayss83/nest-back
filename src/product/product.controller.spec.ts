import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;
  const mockProductList = [{}, {}];
  const mockProduct = {};
  const mockUserId = 'mockUserId';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAllUserProducts: jest.fn().mockResolvedValue(mockProductList),
            saveProduct: jest
              .fn()
              .mockImplementation((customer, _id) => customer),
            deleteProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return list of products', async () => {
      const result = await controller.getAllProducts({
        user: { id: mockUserId },
      });

      expect(
        controller['productService'].findAllUserProducts,
      ).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(mockProductList);
    });
  });

  describe('saveProduct', () => {
    it('should return product', () => {
      const result = controller.saveProduct({
        body: mockProduct,
        user: { id: mockUserId },
      });

      expect(controller['productService'].saveProduct).toHaveBeenCalledWith(
        mockProduct,
        mockUserId,
      );
      expect(result).toBe(mockProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should request product deletion', () => {
      controller.deleteProduct('productId', { user: { id: mockUserId } });

      expect(controller['productService'].deleteProduct).toHaveBeenCalledWith(
        'productId',
        mockUserId,
      );
    });
  });
});
