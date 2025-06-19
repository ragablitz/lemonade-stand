import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BeveragesService } from './beverages.service';
import { BeveragesController } from './beverages.controller';
import { Beverage } from './entities/beverage.entity';
import { BeverageSize } from './entities/beverage-size.entity';

@Module({
  // Register entities with TypeORM for database operations
  imports: [TypeOrmModule.forFeature([Beverage, BeverageSize])],
  controllers: [BeveragesController],
  providers: [BeveragesService],
  exports: [BeveragesService],
})
export class BeveragesModule {}