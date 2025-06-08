import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  beverageName!: string;

  @Column()
  beverageSize!: string;

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
}