import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Use Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Enable CORS
  app.enableCors();
  
  await app.listen(3000);
  console.log('Digital Lemonade Stand API is running on http://localhost:3000');
}
bootstrap();