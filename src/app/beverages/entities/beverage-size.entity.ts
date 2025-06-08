import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Beverage } from './beverage.entity';

@Entity('beverage_sizes')
export class BeverageSize {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  size!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ default: true })
  isAvailable!: boolean;

  @ManyToOne(() => Beverage, (beverage) => beverage.sizes, { onDelete: 'CASCADE' })
  beverage?: Beverage;

  @Column()
  beverageId!: number;
}