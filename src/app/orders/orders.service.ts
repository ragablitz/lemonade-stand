import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { BeveragesService } from '../beverages/beverages.service';
import { v4 as uuidv4 } from 'uuid';
import { BeverageSize } from '../beverages/entities/beverage-size.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(BeverageSize)
    private beverageSizesRepository: Repository<BeverageSize>
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    
    const orderItems: Partial<OrderItem>[] = [];
    let totalPrice = 0;

    for (const itemDto of createOrderDto.items) {
      const beverage = await this.beveragesService.findOne(itemDto.beverageId);
      
      const beverageSize = beverage.sizes.find(
        size => size.id === itemDto.beverageSizeId && size.isAvailable
      );

      if (!beverageSize) {
        throw new BadRequestException(
          `Size with ID ${itemDto.beverageSizeId} not available for beverage ${beverage.name}`
        );
      }

      const subtotal = beverageSize.price * itemDto.quantity;
      totalPrice += subtotal;

      orderItems.push({
        beverageName: beverage.name,
        beverageSize: beverageSize.size,
        unitPrice: beverageSize.price,
        quantity: itemDto.quantity,
        subtotal,
        beverageId: beverage.id,
        beverageSizeId: beverageSize.id,
      });
    }

    // Create order
    const order = this.orderRepository.create({
      confirmationNumber: this.generateConfirmationNumber(),
      customerName: createOrderDto.customerName,
      customerContact: createOrderDto.customerContact,
      totalPrice,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    const items = orderItems.map(item =>
      this.orderItemRepository.create({
        ...item,
        orderId: savedOrder.id,
      })
    );

    await this.orderItemRepository.save(items);

    return this.findOne(savedOrder.id);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByConfirmationNumber(confirmationNumber: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { confirmationNumber },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with confirmation number ${confirmationNumber} not found`);
    }

    return order;
  }

  private generateConfirmationNumber(): string {
    return `LS-${Date.now()}-${uuidv4().substr(0, 8).toUpperCase()}`;
  }
}