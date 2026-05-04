import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { DatabaseSeeder } from './database/database.seeder';

@Module({
  imports: [
    // Variables de entorno disponibles globalmente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Conexión TypeORM a PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,  // ← necesario para Aiven
        },
      }),
    }),

    // Registrar entidad User para el Seeder
    TypeOrmModule.forFeature([User]),

    AuthModule,
    UsersModule,
  ],
  providers: [DatabaseSeeder],
})
export class AppModule { }
