import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery 
} from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

   // POST /orders - Submit new order
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Submit a new order',
    description: 'Creates a new order with items and returns confirmation details'
  })
   @ApiResponse({ status: 400, description: 'Invalid order data' })
  @ApiResponse({ status: 404, description: 'Beverage size not found' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all orders (admin)',
    description: 'Retrieve all orders with optional filtering'
  })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get order statistics',
    description: 'Get summary statistics for orders'
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Get('confirmation/:confirmationNumber')
  @ApiOperation({ 
    summary: 'Get order by confirmation number',
    description: 'Retrieve order details using the confirmation number'
  })
   @ApiResponse({ status: 200, description: 'Order found' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findByConfirmationNumber(@Param('confirmationNumber') confirmationNumber: string) {
    return this.ordersService.findByConfirmationNumber(confirmationNumber);
  }
}