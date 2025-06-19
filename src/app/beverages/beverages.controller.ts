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
  Query,
  Put,
} from '@nestjs/common';
import { BeveragesService } from './beverages.service';
import { CreateBeverageDto } from './dto/create-beverage.dto';
import { UpdateBeverageDto } from './dto/update-beverage.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateBeverageSizeDto } from './dto/create-beverage-size.dto';

@ApiTags('beverages')
@Controller('beverages')
export class BeveragesController {
  constructor(private readonly beveragesService: BeveragesService) {}

  // POST /beverages - Create new beverage type
  @Post()@HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new beverage type' })
  @ApiResponse({ status: 201, description: 'Beverage created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createBeverageDto: CreateBeverageDto) {
    return this.beveragesService.create(createBeverageDto);
  }

  // GET /beverages - List all beverages with their sizes
  @Get()
  @ApiOperation({ summary: 'Get all beverages with their sizes and prices' })
  @ApiResponse({ status: 200, description: 'List of beverages retrieved successfully' })
  async getAllBeverages(
    @Query('includeInactive') includeInactive?: string
  ) {
    const showInactive = includeInactive === 'true';
    return this.beveragesService.findAll();
  }

  // GET /beverages/:id - Get specific beverage
  @Get(':id')
  @ApiOperation({ summary: 'Get a beverage by ID' })
  @ApiResponse({ status: 200, description: 'Beverage retrieved successfully' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.beveragesService.findOne(id);
  }

  // PUT /beverages/:id - Update beverage
  @Put(':id')
  @ApiOperation({ summary: 'Update a beverage by ID' })
  @ApiResponse({ status: 200, description: 'Beverage updated successfully' })
  @ApiResponse({ status: 404, description: 'Beverage not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBeverageDto: UpdateBeverageDto,
  ) {
    return this.beveragesService.update(id, updateBeverageDto);
  }

  // DELETE /beverages/:id - Delete beverage
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a beverage and all its sizes' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.beveragesService.remove(id);
  }

  // Size management endpoints
  // POST /beverages/:id/sizes - Add size to beverage
  @Post(':id/sizes')
  createSize(
    @Param('id', ParseIntPipe) beverageId: number,
    @Body() createSizeDto: CreateBeverageSizeDto,
  ) {
    return this.beveragesService.createSize(beverageId, createSizeDto);
  }

  // PUT /beverages/:id/sizes/:sizeId - Update size
  @Put(':beverageId/sizes/:sizeId')
  updateSize(
    @Param('beverageId', ParseIntPipe) beverageId: number,
    @Param('sizeId', ParseIntPipe) sizeId: number,
    @Body() updateSizeDto: Partial<CreateBeverageSizeDto>,
  ) {
    return this.beveragesService.updateSize(beverageId, sizeId, updateSizeDto);
  }

   // DELETE /beverages/:id/sizes/:sizeId - Remove size
  @Delete(':beverageId/sizes/:sizeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeSize(
    @Param('beverageId', ParseIntPipe) beverageId: number,
    @Param('sizeId', ParseIntPipe) sizeId: number,
  ) {
    return this.beveragesService.removeSize(beverageId, sizeId);
  }
}