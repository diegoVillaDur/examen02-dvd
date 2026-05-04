"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API Gestión de Usuarios')
        .setDescription('API REST con control de acceso basado en roles (RBAC)')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa el token JWT obtenido en POST /auth/login',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
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
//# sourceMappingURL=main.js.map