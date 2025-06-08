import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBeverageSizeDto {
  @IsString()
  size!: string;

  @IsString()
  price!: string;
}