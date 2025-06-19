import { IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({
    description: 'ID of the beverage',
    example: 1
  })
  @IsNumber()
  beverageId!: number;

  @ApiProperty({
    description: 'ID of the beverage size',
    example: 1
  })
  @IsNumber()
  beverageSizeId!: number;

  @ApiProperty({
    description: 'Quantity of the beverage',
    example: 2
  })
  @IsNumber()
  @IsPositive()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity!: number;

  @ApiPropertyOptional({
    description: 'Special notes for this item',
    example: 'Extra ice, no sugar'
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  itemNotes?: string;
}