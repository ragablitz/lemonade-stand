import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbType = configService.get('DB_TYPE') || 'sqlite';
    return {
      type: 'sqlite',
      database: configService.get('DB_SQLITE_PATH') || 'lemonade_stand.db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
      logging: configService.get('NODE_ENV') === 'development',
    };
  }