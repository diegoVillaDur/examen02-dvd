import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * DTO para actualización parcial de usuario.
 * Todos los campos son opcionales pero deben cumplir las mismas validaciones.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
