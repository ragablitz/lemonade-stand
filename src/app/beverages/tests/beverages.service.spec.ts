import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BeveragesService } from '../beverages.service';
import { Beverage } from '../entities/beverage.entity';
import { BeverageSize } from '../entities/beverage-size.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('BeveragesService', () => {
  let service: BeveragesService;
  let beverageRepository: Repository<Beverage>;
  let beverageSizeRepository: Repository<BeverageSize>;

  const mockBeverageRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockBeverageSizeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BeveragesService,
        {
          provide: getRepositoryToken(Beverage),
          useValue: mockBeverageRepository,
        },
        {
          provide: getRepositoryToken(BeverageSize),
          useValue: mockBeverageSizeRepository,
        },
      ],
    }).compile();

    service = module.get<BeveragesService>(BeveragesService);
    beverageRepository = module.get<Repository<Beverage>>(getRepositoryToken(Beverage));
    beverageSizeRepository = module.get<Repository<BeverageSize>>(getRepositoryToken(BeverageSize));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new beverage', async () => {
      const createBeverageDto = {
        name: 'Classic Lemonade',
        description: 'Fresh squeezed lemonade',
      };

      const mockBeverage = { id: 1, ...createBeverageDto };

      mockBeverageRepository.findOne.mockResolvedValue(null);
      mockBeverageRepository.create.mockReturnValue(mockBeverage);
      mockBeverageRepository.save.mockResolvedValue(mockBeverage);
      
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBeverage as any);

      const result = await service.create(createBeverageDto);

      expect(result).toEqual(mockBeverage);
      expect(mockBeverageRepository.create).toHaveBeenCalledWith(createBeverageDto);
      expect(mockBeverageRepository.save).toHaveBeenCalledWith(mockBeverage);
    });

    it('should throw ConflictException if beverage name already exists', async () => {
      const createBeverageDto = {
        name: 'Classic Lemonade',
        description: 'Fresh squeezed lemonade',
      };

      mockBeverageRepository.findOne.mockResolvedValue({ id: 1, name: 'Classic Lemonade' });

      await expect(service.create(createBeverageDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a beverage if found', async () => {
      const mockBeverage = { id: 1, name: 'Classic Lemonade' };
      mockBeverageRepository.findOne.mockResolvedValue(mockBeverage);

      const result = await service.findOne(1);

      expect(result).toEqual(mockBeverage);
      expect(mockBeverageRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['sizes'],
      });
    });

    it('should throw NotFoundException if beverage not found', async () => {
      mockBeverageRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
