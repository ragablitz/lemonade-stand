import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { BeverageSize } from '../../beverages/entities/beverage-size.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  beverageName!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice!: number;

  @Column()
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal!: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order!: Order;

  @Column()
  orderId!: number;

  @Column()
  beverageId!: number;

  @Column()
  beverageSizeId!: number;

  // Many order items reference one beverage size
  @ManyToOne(() => BeverageSize, {
    eager: true // Always load beverage size info
  })
  @JoinColumn({ name: 'beverageSizeId' })
  beverageSize!: BeverageSize;

}