import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorador para asignar roles requeridos a un endpoint.
 * Uso: @Roles(Role.ADMIN, Role.DEVELOPER)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
