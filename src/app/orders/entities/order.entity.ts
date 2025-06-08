import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  confirmationNumber!: string;

  @Column()
  customerName!: string;

  @Column()
  customerContact!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({
    type: 'simple-enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items!: OrderItem[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}