import { Test, TestingModule } from '@nestjs/testing';
import { BeveragesController } from './beverages.controller';
import { BeveragesService } from './beverages.service';
import { CreateBeverageDto } from './dto/create-beverage.dto';
import { UpdateBeverageDto } from './dto/update-beverage.dto';
import { CreateBeverageSizeDto } from './dto/create-beverage-size.dto';

describe('BeveragesController', () => {
  let controller: BeveragesController;
  let service: BeveragesService;

  const mockBeveragesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createSize: jest.fn(),
    updateSize: jest.fn(),
    removeSize: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeveragesController],
      providers: [
        {
          provide: BeveragesService,
          useValue: mockBeveragesService,
        },
      ],
    }).compile();

    controller = module.get<BeveragesController>(BeveragesController);
    service = module.get<BeveragesService>(BeveragesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new beverage', async () => {
      const createBeverageDto: CreateBeverageDto = {
        name: 'Classic Lemonade',
        description: 'Fresh squeezed lemonade',
      };

      const mockBeverage = {
        id: 1,
        ...createBeverageDto,
        sizes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockBeveragesService.create.mockResolvedValue(mockBeverage);

      const result = await controller.create(createBeverageDto);

      expect(result).toEqual(mockBeverage);
      expect(service.create).toHaveBeenCalledWith(createBeverageDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of beverages', async () => {
      const mockBeverages = [
        {
          id: 1,
          name: 'Classic Lemonade',
          description: 'Fresh squeezed lemonade',
          sizes: [],
        },
        {
          id: 2,
          name: 'Strawberry Fizz',
          description: 'Fizzy strawberry drink',
          sizes: [],
        },
      ];

      mockBeveragesService.findAll.mockResolvedValue(mockBeverages);

      const result = await controller.findAll();

      expect(result).toEqual(mockBeverages);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a beverage by id', async () => {
      const mockBeverage = {
        id: 1,
        name: 'Classic Lemonade',
        description: 'Fresh squeezed lemonade',
        sizes: [],
      };

      mockBeveragesService.findOne.mockResolvedValue(mockBeverage);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockBeverage);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a beverage', async () => {
      const updateBeverageDto: UpdateBeverageDto = {
        name: 'Premium Lemonade',
      };

      const mockUpdatedBeverage = {
        id: 1,
        name: 'Premium Lemonade',
        description: 'Fresh squeezed lemonade',
        sizes: [],
      };

      mockBeveragesService.update.mockResolvedValue(mockUpdatedBeverage);

      const result = await controller.update(1, updateBeverageDto);

      expect(result).toEqual(mockUpdatedBeverage);
      expect(service.update).toHaveBeenCalledWith(1, updateBeverageDto);
    });
  });

  describe('remove', () => {
    it('should remove a beverage', async () => {
      mockBeveragesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('createSize', () => {
    it('should create a size for a beverage', async () => {
      const createSizeDto: CreateBeverageSizeDto = {
        size: 'Large',
        price: 4.50,
      };

      const mockSize = {
        id: 1,
        size: 'Large',
        price: 4.50,
        isAvailable: true,
        beverageId: 1,
      };

      mockBeveragesService.createSize.mockResolvedValue(mockSize);

      const result = await controller.createSize(1, createSizeDto);

      expect(result).toEqual(mockSize);
      expect(service.createSize).toHaveBeenCalledWith(1, createSizeDto);
    });
  });

  describe('updateSize', () => {
    it('should update a size for a beverage', async () => {
      const updateSizeDto = { price: 5.00 };

      const mockUpdatedSize = {
        id: 1,
        size: 'Large',
        price: 5.00,
        isAvailable: true,
        beverageId: 1,
      };

      mockBeveragesService.updateSize.mockResolvedValue(mockUpdatedSize);

      const result = await controller.updateSize(1, 1, updateSizeDto);

      expect(result).toEqual(mockUpdatedSize);
      expect(service.updateSize).toHaveBeenCalledWith(1, 1, updateSizeDto);
    });
  });

  describe('removeSize', () => {
    it('should remove a size from a beverage', async () => {
      mockBeveragesService.removeSize.mockResolvedValue(undefined);

      const result = await controller.removeSize(1, 1);

      expect(result).toBeUndefined();
      expect(service.removeSize).toHaveBeenCalledWith(1, 1);
    });
  });
});