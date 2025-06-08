import { IsNumber, IsPositive, Min } from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  beverageId!: number;
  @IsNumber()
  beverageSizeId!: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity!: number;
}