import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { Role } from '../common/enums/role.enum';

/**
 * Seeder que se ejecuta al iniciar la app.
 * Crea el usuario admin inicial si no existe.
 *
 * Credenciales por defecto:
 *   username: admin
 *   password: Admin@12345
 *   role: ADMIN
 */
@Injectable()
export class DatabaseSeeder implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminExists = await this.usersRepository.findOne({
      where: { username: 'admin' },
    });

    if (adminExists) {
      this.logger.log('Usuario admin ya existe, omitiendo seed.');
      return;
    }

    const hashedPassword = await bcrypt.hash('Admin@12345', 10);

    const admin = this.usersRepository.create({
      nombre: 'Administrador del Sistema',
      username: 'admin',
      password: hashedPassword,
      role: Role.ADMIN,
    });

    await this.usersRepository.save(admin);
    this.logger.log('✅ Usuario admin creado: username=admin | password=Admin@12345');
  }
}
