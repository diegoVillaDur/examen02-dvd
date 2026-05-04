import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * Registra un nuevo usuario con rol USER por defecto.
   * Encripta la contraseña con bcrypt antes de guardar.
   */
  async register(registerDto: RegisterDto) {
    // Delegar la creación al UsersService (que siempre asigna rol USER)
    const user = await this.usersService.create(registerDto);
    return {
      message: 'Usuario registrado exitosamente',
      user,
    };
  }

  /**
   * Valida credenciales y retorna un token JWT.
   * El payload del token incluye: id, username, role.
   */
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Buscar usuario con password incluido (select: false en entidad)
    const user = await this.usersService.findByUsernameWithPassword(username);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Payload del token JWT
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
      user: {
        id: user.id,
        nombre: user.nombre,
        username: user.username,
        role: user.role,
      },
    };
  }
}
