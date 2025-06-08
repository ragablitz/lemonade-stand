import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBeverageSizeDto } from './create-beverage-size.dto';

export class CreateBeverageDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBeverageSizeDto)
  sizes?: CreateBeverageSizeDto[];
}