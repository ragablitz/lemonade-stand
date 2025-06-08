import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersService } from '../orders.service';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { BeveragesService } from '../beverages/beverages.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;
  let beveragesService: BeveragesService;

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockOrderItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockBeveragesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
        {
          provide: BeveragesService,
          useValue: mockBeveragesService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
    beveragesService = module.get<BeveragesService>(BeveragesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createOrderDto = {
      customerName: 'John Doe',
      customerContact: 'john@example.com',
      items: [
        {
          beverageId: 1,
          beverageSizeId: 1,
          quantity: 2,
        },
      ],
    };

    const mockBeverage = {
      id: 1,
      name: 'Classic Lemonade',
      sizes: [
        {
          id: 1,
          size: 'Medium',
          price: 3.00,
          isAvailable: true,
        },
      ],
    };

    it('should create a new order successfully', async () => {
      const mockOrder = {
        id: 1,
        confirmationNumber: 'LS-123456-ABCD1234',
        customerName: 'John Doe',
        customerContact: 'john@example.com',
        totalPrice: 6.00,
        status: OrderStatus.PENDING,
      };

      const mockOrderItems = [
        {
          beverageName: 'Classic Lemonade',
          beverageSize: 'Medium',
          unitPrice: 3.00,
          quantity: 2,
          subtotal: 6.00,
          beverageId: 1,
          beverageSizeId: 1,
          orderId: 1,
        },
      ];

      mockBeveragesService.findOne.mockResolvedValue(mockBeverage);
      mockOrderRepository.create.mockReturnValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);
      mockOrderItemRepository.create.mockImplementation((item) => item);
      mockOrderItemRepository.save.mockResolvedValue(mockOrderItems);
      
      jest.spyOn(service, 'findOne').mockResolvedValue({
        ...mockOrder,
        items: mockOrderItems,
      } as any);

      const result = await service.create(createOrderDto);

      expect(result.customerName).toBe('John Doe');
      expect(result.totalPrice).toBe(6.00);
      expect(result.items).toHaveLength(1);
      expect(mockBeveragesService.findOne).toHaveBeenCalledWith(1);
      expect(mockOrderRepository.save).toHaveBeenCalled();
      expect(mockOrderItemRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if beverage size is not available', async () => {
      const mockBeverageWithUnavailableSize = {
        ...mockBeverage,
        sizes: [
          {
            id: 1,
            size: 'Medium',
            price: 3.00,
            isAvailable: false, // Not available
          },
        ],
      };

      mockBeveragesService.findOne.mockResolvedValue(mockBeverageWithUnavailableSize);

      await expect(service.create(createOrderDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if beverage size does not exist', async () => {
      const mockBeverageWithDifferentSize = {
        ...mockBeverage,
        sizes: [
          {
            id: 2, // Different size ID
            size: 'Large',
            price: 4.00,
            isAvailable: true,
          },
        ],
      };

      mockBeveragesService.findOne.mockResolvedValue(mockBeverageWithDifferentSize);

      await expect(service.create(createOrderDto)).rejects.toThrow(BadRequestException);
    });

    it('should calculate total price correctly for multiple items', async () => {
      const multiItemOrderDto = {
        customerName: 'Jane Doe',
        customerContact: 'jane@example.com',
        items: [
          {
            beverageId: 1,
            beverageSizeId: 1,
            quantity: 2,
          },
          {
            beverageId: 1,
            beverageSizeId: 1,
            quantity: 1,
          },
        ],
      };

      const mockOrder = {
        id: 1,
        confirmationNumber: 'LS-123456-ABCD1234',
        customerName: 'Jane Doe',
        customerContact: 'jane@example.com',
        totalPrice: 9.00, // 2*3 + 1*3 = 9
        status: OrderStatus.PENDING,
      };

      mockBeveragesService.findOne.mockResolvedValue(mockBeverage);
      mockOrderRepository.create.mockReturnValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);
      mockOrderItemRepository.create.mockImplementation((item) => item);
      mockOrderItemRepository.save.mockResolvedValue([]);
      
      jest.spyOn(service, 'findOne').mockResolvedValue({
        ...mockOrder,
        items: [],
      } as any);

      const result = await service.create(multiItemOrderDto);

      expect(result.totalPrice).toBe(9.00);
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const mockOrders = [
        {
          id: 1,
          confirmationNumber: 'LS-123456-ABCD1234',
          customerName: 'John Doe',
          totalPrice: 6.00,
          items: [],
        },
        {
          id: 2,
          confirmationNumber: 'LS-123457-EFGH5678',
          customerName: 'Jane Doe',
          totalPrice: 4.50,
          items: [],
        },
      ];

      mockOrderRepository.find.mockResolvedValue(mockOrders);

      const result = await service.findAll();

      expect(result).toEqual(mockOrders);
      expect(mockOrderRepository.find).toHaveBeenCalledWith({
        relations: ['items'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return an order if found', async () => {
      const mockOrder = {
        id: 1,
        confirmationNumber: 'LS-123456-ABCD1234',
        customerName: 'John Doe',
        items: [],
      };

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);

      expect(result).toEqual(mockOrder);
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['items'],
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByConfirmationNumber', () => {
    it('should return an order if found by confirmation number', async () => {
      const mockOrder = {
        id: 1,
        confirmationNumber: 'LS-123456-ABCD1234',
        customerName: 'John Doe',
        items: [],
      };

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findByConfirmationNumber('LS-123456-ABCD1234');

      expect(result).toEqual(mockOrder);
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
        where: { confirmationNumber: 'LS-123456-ABCD1234' },
        relations: ['items'],
      });
    });

    it('should throw NotFoundException if order not found by confirmation number', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.findByConfirmationNumber('INVALID-NUMBER'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('generateConfirmationNumber', () => {
    it('should generate a unique confirmation number', () => {
      const confirmationNumber1 = (service as any).generateConfirmationNumber();
      const confirmationNumber2 = (service as any).generateConfirmationNumber();

      expect(confirmationNumber1).toMatch(/^LS-\d+-[A-Z0-9]{8}$/);
      expect(confirmationNumber2).toMatch(/^LS-\d+-[A-Z0-9]{8}$/);
      expect(confirmationNumber1).not.toBe(confirmationNumber2);
    });
  });
});
```

### orders.controller.spec.ts
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByConfirmationNumber: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        customerName: 'John Doe',
        customerContact: 'john@example.com',
        items: [
          {
            beverageId: 1,
            beverageSizeId: 1,
            quantity: 2,
          },
        ],
      };

      const mockOrder = {
        id: 1,
        confirmationNumber: 'LS-123456-ABCD1234',
        customerName: 'John Doe',
        customerContact: 'john@example.com',
        totalPrice: 6.00,
        status: OrderStatus.PENDING,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockOrdersService.create.mockResolvedValue(mockOrder);

      const result = await controller.create(createOrderDto);

      expect(result).toEqual(mockOrder);
      expect(service.create).toHaveBeenCalledWith(createOrderDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const mockOrders = [
        {
          id: 1,
          confirmationNumber: 'LS-123456-ABCD1234',
          customerName: 'John Doe',
          totalPrice: 6.00,
          items: [],
        },
        {
          id: 2,
          confirmationNumber: 'LS-123457-EFGH5678',
          customerName: 'Jane Doe',
          totalPrice: 4.50,
          items: [],
        },
      ];

      mockOrdersService.findAll.mockResolvedValue(mockOrders);

      const result = await controller.findAll();

      expect(result).toEqual(mockOrders);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      const mockOrder = {
        id: 1,
        confirmationNumber: 'LS-123456-ABCD1234',
        customerName: 'John Doe',
        items: [],
      };

      mockOrdersService.findOne.mockResolvedValue(mockOrder);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockOrder);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findByConfirmationNumber', () => {
    it('should return an order by confirmation number', async () => {
      const mockOrder = {
        id: 1,
        confirmationNumber: 'LS-123456-ABCD1234',
        customerName: 'John Doe',
        items: [],
      };

      mockOrdersService.findByConfirmationNumber.mockResolvedValue(mockOrder);

      const result = await controller.findByConfirmationNumber('LS-123456-ABCD1234');

      expect(result).toEqual(mockOrder);
      expect(service.findByConfirmationNumber).toHaveBeenCalledWith('LS-123456-ABCD1234');
    });
  });
});