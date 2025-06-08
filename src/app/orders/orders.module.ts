import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { BeveragesModule } from '../beverages/beverages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    BeveragesModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}