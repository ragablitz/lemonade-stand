import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderStatus } from '../entities/order.entity';

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