import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BeveragesService } from './beverages.service';
import { CreateBeverageDto } from './dto/create-beverage.dto';
import { UpdateBeverageDto } from './dto/update-beverage.dto';
import { CreateBeverageSizeDto } from './dto/create-beverage-size.dto';

@Controller('beverages')
export class BeveragesController {
  constructor(private readonly beveragesService: BeveragesService) {}

  @Post()
  create(@Body() createBeverageDto: CreateBeverageDto) {
    return this.beveragesService.create(createBeverageDto);
  }

  @Get()
  findAll() {
    return this.beveragesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.beveragesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBeverageDto: UpdateBeverageDto,
  ) {
    return this.beveragesService.update(id, updateBeverageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.beveragesService.remove(id);
  }

  // Size management endpoints
  @Post(':id/sizes')
  createSize(
    @Param('id', ParseIntPipe) beverageId: number,
    @Body() createSizeDto: CreateBeverageSizeDto,
  ) {
    return this.beveragesService.createSize(beverageId, createSizeDto);
  }

  @Patch(':beverageId/sizes/:sizeId')
  updateSize(
    @Param('beverageId', ParseIntPipe) beverageId: number,
    @Param('sizeId', ParseIntPipe) sizeId: number,
    @Body() updateSizeDto: Partial<CreateBeverageSizeDto>,
  ) {
    return this.beveragesService.updateSize(beverageId, sizeId, updateSizeDto);
  }

  @Delete(':beverageId/sizes/:sizeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeSize(
    @Param('beverageId', ParseIntPipe) beverageId: number,
    @Param('sizeId', ParseIntPipe) sizeId: number,
  ) {
    return this.beveragesService.removeSize(beverageId, sizeId);
  }
}