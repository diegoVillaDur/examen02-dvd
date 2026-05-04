import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

interface JwtPayload { id: string; username: string; role: Role; }

const userExample = { id: 'uuid', nombre: 'Juan Pérez', username: 'juanperez', role: 'USER', createdAt: '2026-05-04T00:00:00.000Z' };
const unauthorizedExample = { statusCode: 401, message: 'Token inválido o ausente. Por favor inicia sesión.', error: 'Unauthorized' };
const forbiddenExample = { statusCode: 403, message: 'Acceso denegado. Se requiere uno de los siguientes roles: DEVELOPER', error: 'Forbidden' };
const notFoundExample = { statusCode: 404, message: 'Usuario con id "uuid" no encontrado', error: 'Not Found' };

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles(Role.DEVELOPER)
  @ApiOperation({ summary: 'Crear usuario', description: 'Solo DEVELOPER puede crear usuarios. El rol siempre será USER.' })
  @ApiResponse({ status: 201, description: 'Usuario creado', schema: { example: userExample } })
  @ApiResponse({ status: 400, description: 'Datos inválidos', schema: { example: { statusCode: 400, message: ['El username es requerido'], error: 'Bad Request' } } })
  @ApiResponse({ status: 401, description: 'No autenticado', schema: { example: unauthorizedExample } })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere DEVELOPER)', schema: { example: forbiddenExample } })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuarios', description: 'ADMIN/DEVELOPER: todos los usuarios. USER: solo su propio perfil.' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios (o perfil propio si rol=USER)', schema: { example: [userExample] } })
  @ApiResponse({ status: 401, description: 'No autenticado', schema: { example: unauthorizedExample } })
  findAll(@CurrentUser() currentUser: JwtPayload) {
    if (currentUser.role === Role.USER) {
      return this.usersService.findOne(currentUser.id);
    }
    return this.usersService.findAll();
  }

  @Patch(':id')
  @Roles(Role.DEVELOPER)
  @ApiOperation({ summary: 'Actualizar usuario', description: 'Solo DEVELOPER. Todos los campos son opcionales.' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', schema: { example: userExample } })
  @ApiResponse({ status: 400, description: 'Datos inválidos', schema: { example: { statusCode: 400, message: ['El username ya está en uso'], error: 'Bad Request' } } })
  @ApiResponse({ status: 401, description: 'No autenticado', schema: { example: unauthorizedExample } })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere DEVELOPER)', schema: { example: { ...forbiddenExample, message: 'Acceso denegado. Se requiere uno de los siguientes roles: DEVELOPER' } } })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/make-admin')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Promover a ADMIN', description: 'Solo ADMIN puede promover a otro usuario al rol ADMIN.' })
  @ApiParam({ name: 'id', description: 'UUID del usuario a promover', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Usuario promovido a ADMIN', schema: { example: { ...userExample, role: 'ADMIN' } } })
  @ApiResponse({ status: 401, description: 'No autenticado', schema: { example: unauthorizedExample } })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere ADMIN)', schema: { example: { ...forbiddenExample, message: 'Acceso denegado. Se requiere uno de los siguientes roles: ADMIN' } } })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado', schema: { example: notFoundExample } })
  makeAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.makeAdmin(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar usuario', description: 'Solo ADMIN puede eliminar usuarios.' })
  @ApiParam({ name: 'id', description: 'UUID del usuario a eliminar', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado', schema: { example: { message: 'Usuario "juanperez" eliminado correctamente' } } })
  @ApiResponse({ status: 401, description: 'No autenticado', schema: { example: unauthorizedExample } })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere ADMIN)', schema: { example: { ...forbiddenExample, message: 'Acceso denegado. Se requiere uno de los siguientes roles: ADMIN' } } })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado', schema: { example: notFoundExample } })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
