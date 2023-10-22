import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CompanyService } from './company.service';
import { CompanyDocument } from 'src/models/company.model';

describe('CompanyService', () => {
  let companyService: CompanyService;
  let companyModel;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getModelToken('Company'),
          useValue: {
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    companyService = moduleRef.get<CompanyService>(CompanyService);
    companyModel = moduleRef.get(getModelToken('Company'));
  });

  it('should be defined', () => {
    expect(companyService).toBeDefined();
  });

  describe('findUserCompany', () => {
    it('should return a company document', async () => {
      const mockUserId = '123';
      const mockCompany = { name: 'Test Company' } as CompanyDocument;

      jest.spyOn(companyModel, 'findOne').mockReturnValueOnce({
        lean: jest.fn().mockReturnValueOnce({
          exec: jest.fn().mockReturnValueOnce(mockCompany),
        }),
      } as any);

      const result = await companyService.findUserCompany(mockUserId);

      expect(companyModel.findOne).toHaveBeenCalledWith({
        ownerId: mockUserId,
      });

      expect(result).toEqual(mockCompany);
    });
  });

  describe('saveCompany', () => {
    it('should save a company document', async () => {
      const mockOwnerId = '123';
      const mockCompany = { name: 'Test Company' } as Partial<CompanyDocument>;

      jest
        .spyOn(companyModel, 'findOneAndUpdate')
        .mockImplementationOnce(() => Promise.resolve());

      companyService.findUserCompany = jest.fn().mockResolvedValue(mockCompany);

      const result = await companyService.saveCompany(mockCompany, mockOwnerId);

      expect(companyModel.findOneAndUpdate).toHaveBeenCalledWith(
        { ownerId: mockOwnerId },
        { ...mockCompany, ownerId: mockOwnerId },
        { upsert: true },
      );
      expect(result).toEqual(await companyService.findUserCompany(mockOwnerId));
    });
  });
});
