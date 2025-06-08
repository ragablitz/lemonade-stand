import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { OrdersModule } from '../orders.module';
import { BeveragesModule } from '../../beverages/beverages.module';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Beverage } from '../../beverages/entities/beverage.entity';
import { BeverageSize } from '../../beverages/entities/beverage-size.entity';

describe('OrdersController (Integration)', () => {
  let app: INestApplication;
  let beverageId: number;
  let beverageSizeId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        OrdersModule,
        BeveragesModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Order, OrderItem, Beverage, BeverageSize],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create a test beverage with sizes
    const beverageResponse = await request(app.getHttpServer())
      .post('/beverages')
      .send({
        name: 'Test Lemonade',
        description: 'Test lemonade for orders',
        sizes: [
          { size: 'Small', price: '2.00' },
          { size: 'Medium', price: '3.00' },
        ],
      });

    beverageId = beverageResponse.body.id;
    beverageSizeId = beverageResponse.body.sizes[0].id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/orders (POST)', () => {
    it('should create a new order', async () => {
      const createOrderDto = {
        customerName: 'John Doe',
        customerContact: 'john@example.com',
        items: [
          {
            beverageId,
            beverageSizeId,
            quantity: 2,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .send(createOrderDto)
        .expect(201);

      expect(response.body.customerName).toBe('John Doe');
      expect(response.body.totalPrice).toBe(4.00); // 2 * $2.00
      expect(response.body.confirmationNumber).toMatch(/^LS-\d+-[A-Z0-9]{8}$/);
      expect(response.body.items).toHaveLength(1);
    });

    it('should return 400 for invalid beverage size', async () => {
      const createOrderDto = {
        customerName: 'Jane Doe',
        customerContact: 'jane@example.com',
        items: [
          {
            beverageId,
            beverageSizeId: 999, // Non-existent size
            quantity: 1,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/orders')
        .send(createOrderDto)
        .expect(400);
    });

    it('should return 400 for invalid input data', async () => {
      const invalidOrderDto = {
        customerName: '', // Empty name
        customerContact: 'not-an-email', // Invalid email
        items: [], // Empty items
      };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidOrderDto)
        .expect(400);
    });
  });

  describe('/orders (GET)', () => {
    it('should return all orders', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('/orders/:id (GET)', () => {
    it('should return a specific order', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders/1')
        .expect(200);

      expect(response.body.id).toBe(1);
      expect(response.body.customerName).toBe('John Doe');
    });

    it('should return 404 for non-existent order', async () => {
      await request(app.getHttpServer())
        .get('/orders/999')
        .expect(404);
     });
  });
});