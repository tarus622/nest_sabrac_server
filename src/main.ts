import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(UsersModule);
    app.enableCors();

    app.useGlobalPipes(new ValidationPipe());

    process.env.NODE_ENV = process.env.NODE_ENV || 'development';

    await app.listen(3000);
  } catch (error) {
    console.error('Error during application startup:', error);
    process.exit(1); // Terminate the application on startup failure
  }
}
bootstrap();
