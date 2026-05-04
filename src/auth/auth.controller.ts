import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo usuario', description: 'Crea un usuario con rol USER automáticamente. El rol NO puede enviarse en el request.' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente', schema: { example: { message: 'Usuario registrado exitosamente', user: { id: 'uuid', nombre: 'Juan Pérez', username: 'juanperez', role: 'USER', createdAt: '2026-05-04T00:00:00.000Z' } } } })
  @ApiResponse({ status: 400, description: 'Datos inválidos o username ya en uso', schema: { example: { statusCode: 400, message: ['El nombre es requerido', 'El username solo puede contener letras, números y guiones bajos'], error: 'Bad Request' } } })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión', description: 'Valida credenciales y retorna un token JWT. El payload incluye: id, username, role.' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna token JWT', schema: { example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', token_type: 'Bearer', user: { id: 'uuid', nombre: 'Administrador', username: 'admin', role: 'ADMIN' } } } })
  @ApiResponse({ status: 400, description: 'Campos faltantes o inválidos', schema: { example: { statusCode: 400, message: ['El username es requerido'], error: 'Bad Request' } } })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas', schema: { example: { statusCode: 401, message: 'Credenciales inválidas', error: 'Unauthorized' } } })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
