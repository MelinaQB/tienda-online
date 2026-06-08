import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Activar validaciones globales para los DTOs (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Descarta propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían propiedades no permitidas
      transform: true, // Transforma los tipos de datos automáticamente (ej. string a number)
    }),
  );

  // 2. Configurar Swagger/Scalar para la documentación de la API
  const config = new DocumentBuilder()
    .setTitle('Tienda Online API')
    .setDescription('Práctica TAW-251 - Desarrollo Web Backend')
    .setVersion('1.0')
    .addTag('Clientes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Tu documentación estará en http://localhost:3000/api/docs

  app.enableCors();
  // 3. Iniciar la aplicación en el puerto 3000
  await app.listen(3000);
  console.log(`🚀 Servidor corriendo en: http://localhost:3000`);
  console.log(`📄 Documentación disponible en: http://localhost:3000/api/docs`);
}
bootstrap();
