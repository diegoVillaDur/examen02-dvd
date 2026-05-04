import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // ─── Utilidad: quitar password del objeto ─────────────────────────────────
  private sanitize(user: User): SafeUser {
    const { password, ...safe } = user;
    return safe;
  }

  // ─── CREATE ───────────────────────────────────────────────────────────────
  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const exists = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (exists) {
      throw new ConflictException(
        `El username "${createUserDto.username}" ya está en uso`,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      nombre: createUserDto.nombre,
      username: createUserDto.username,
      password: hashedPassword,
      role: Role.USER, // Siempre USER, nunca se recibe el rol
    });

    const saved = await this.usersRepository.save(user);
    return this.sanitize(saved);
  }

  // ─── READ ALL ─────────────────────────────────────────────────────────────
  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.find();
    return users.map((u) => this.sanitize(u));
  }

  // ─── READ ONE ─────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<SafeUser> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }

    return this.sanitize(user);
  }

  // ─── Buscar con password (para Auth) ─────────────────────────────────────
  async findByUsernameWithPassword(username: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
  }

  // ─── UPDATE ───────────────────────────────────────────────────────────────
  async update(id: string, updateUserDto: UpdateUserDto): Promise<SafeUser> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }

    // Verificar username único si se está actualizando
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const usernameExists = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (usernameExists) {
        throw new ConflictException(
          `El username "${updateUserDto.username}" ya está en uso`,
        );
      }
    }

    // Encriptar nueva contraseña si se envía
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const updated = await this.usersRepository.save(user);
    return this.sanitize(updated);
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }

    await this.usersRepository.remove(user);
    return { message: `Usuario "${user.username}" eliminado correctamente` };
  }

  // ─── MAKE ADMIN ───────────────────────────────────────────────────────────
  async makeAdmin(id: string): Promise<SafeUser> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }

    user.role = Role.ADMIN;
    const updated = await this.usersRepository.save(user);
    return this.sanitize(updated);
  }
}
