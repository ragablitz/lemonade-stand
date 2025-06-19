import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBeverageSizeDto } from './create-beverage-size.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBeverageDto {
  @ApiProperty({ 
    description: 'Name of the beverage',
    example: 'Classic Lemonade' 
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ 
    description: 'Description of the beverage',
    example: 'A refreshing blend of lemon juice, water, and sugar' 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Whether the beverage is active',
    default: true 
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

}