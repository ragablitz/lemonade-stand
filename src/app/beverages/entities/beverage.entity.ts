import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BeverageSize } from './beverage-size.entity';

@Entity('beverages')
export class Beverage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => BeverageSize, (size) => size.beverage, { cascade: true })
  sizes!: BeverageSize[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}