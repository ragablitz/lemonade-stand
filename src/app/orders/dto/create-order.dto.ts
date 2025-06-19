import { IsString, IsEmail, IsArray, ValidateNested, ArrayMinSize, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty({
    description: 'Customer full name',
    example: 'John Smith'
  })
  @MinLength(2, { message: 'Customer name must be at least 2 characters' })
  @MaxLength(100, { message: 'Customer name cannot exceed 100 characters' })
  @IsString()
  customerName!: string;

   @ApiProperty({
    description: 'Customer email address',
    example: 'john.smith@email.com'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255)
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  customerContact!: string;

    @ApiProperty({
    description: 'List of ordered items',
    type: [OrderItemDto]
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @ApiPropertyOptional({
    description: 'Special instructions for the entire order',
    example: 'Please prepare for pickup at 2:30 PM'
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  specialInstructions?: string;
}