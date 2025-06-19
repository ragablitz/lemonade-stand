import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBeverageSizeDto {
  @ApiProperty({ 
     description: 'Size name',
    example: 'Medium' 
  })
  @IsString()
  size!: string;

  @ApiPropertyOptional({ 
    description: 'Description of the beverage',
    example: 'Fresh squeezed lemons with the perfect amount of sugar' 
  })
  @IsString()
  description!: string;

  @ApiProperty({ 
    description: 'Price of the beverage',
    example: '2.99' 
  })
  @IsString()
  price!: string;

  @ApiPropertyOptional({ 
    description: 'Whether this size is available',
    default: true 
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}