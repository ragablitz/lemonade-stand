import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBeverageSizeDto {
  @IsString()
  size!: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  price!: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}