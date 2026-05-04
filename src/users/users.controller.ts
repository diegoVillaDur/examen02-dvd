import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

interface JwtPayload {
  id: string;
  username: string;
  role: Role;
}

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Todos los endpoints requieren autenticación
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Solo DEVELOPER puede crear usuarios directamente
   */
  @Post()
  @Roles(Role.DEVELOPER)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users
   * - ADMIN y DEVELOPER: ven todos los usuarios
   * - USER: ve solo su propio perfil
   */
  @Get()
  findAll(@CurrentUser() currentUser: JwtPayload) {
    if (currentUser.role === Role.USER) {
      return this.usersService.findOne(currentUser.id);
    }
    return this.usersService.findAll();
  }

  /**
   * PATCH /users/:id
   * Solo DEVELOPER puede actualizar usuarios
   */
  @Patch(':id')
  @Roles(Role.DEVELOPER)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * PATCH /users/:id/make-admin
   * Solo ADMIN puede promover a otro usuario a ADMIN
   */
  @Patch(':id/make-admin')
  @Roles(Role.ADMIN)
  makeAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.makeAdmin(id);
  }

  /**
   * DELETE /users/:id
   * Solo ADMIN puede eliminar usuarios
   */
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
