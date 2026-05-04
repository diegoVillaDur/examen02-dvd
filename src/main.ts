import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // ── Validación global con class-validator ──────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Elimina campos no declarados en DTOs
      forbidNonWhitelisted: true, // Lanza error si se envían campos no permitidos
      transform: true,            // Transforma tipos automáticamente
    }),
  );


  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API Gestión de Usuarios')
    .setDescription('API REST con control de acceso basado en roles (RBAC)')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa el token JWT obtenido en POST /auth/login',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Aplicación corriendo en: http://localhost:${port}`);
  logger.log(`📌 Endpoints disponibles:`);
  logger.log(`   POST   /auth/register`);
  logger.log(`   POST   /auth/login`);
  logger.log(`   GET    /users          (ADMIN, DEVELOPER, USER-propio)`);
  logger.log(`   POST   /users          (DEVELOPER)`);
  logger.log(`   PATCH  /users/:id      (DEVELOPER)`);
  logger.log(`   PATCH  /users/:id/make-admin (ADMIN)`);
  logger.log(`   DELETE /users/:id      (ADMIN)`);
}

bootstrap();
