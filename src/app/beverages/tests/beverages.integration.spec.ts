import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { BeveragesModule } from '../beverages.module';
import { Beverage } from '../entities/beverage.entity';
import { BeverageSize } from '../entities/beverage-size.entity';

describe('BeveragesController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        BeveragesModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Beverage, BeverageSize],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/beverages (POST)', () => {
    it('should create a new beverage', async () => {
      const createBeverageDto = {
        name: 'Classic Lemonade',
        description: 'Fresh squeezed lemonade',
        sizes: [
          { size: 'Small', price: '2.00' },
          { size: 'Medium', price: '3.00' },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/beverages')
        .send(createBeverageDto)
        .expect(201);

      expect(response.body.name).toBe('Classic Lemonade');
      expect(response.body.sizes).toHaveLength(2);
    });

    it('should return 409 for duplicate beverage name', async () => {
      const createBeverageDto = {
        name: 'Classic Lemonade', // Already exists from previous test
        description: 'Another lemonade',
      };

      await request(app.getHttpServer())
        .post('/beverages')
        .send(createBeverageDto)
        .expect(409);
    });
  });

  describe('/beverages (GET)', () => {
    it('should return all beverages', async () => {
      const response = await request(app.getHttpServer())
        .get('/beverages')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('/beverages/:id (GET)', () => {
    it('should return a specific beverage', async () => {
      const response = await request(app.getHttpServer())
        .get('/beverages/1')
        .expect(200);

      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('Classic Lemonade');
    });

    it('should return 404 for non-existent beverage', async () => {
      await request(app.getHttpServer())
        .get('/beverages/999')
        .expect(404);
    });
  });
});