import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BeveragesModule } from './beverages/beverages.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from '../config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
    }),
    BeveragesModule,
    OrdersModule,
  ],
})
export class AppModule {}