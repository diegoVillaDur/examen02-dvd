import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard que valida el token JWT en el header Authorization.
 * Uso: @UseGuards(JwtAuthGuard)
 *
 * Extrae automáticamente el payload del token y lo inyecta en request.user.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException(
        'Token inválido o ausente. Por favor inicia sesión.',
      );
    }
    return user;
  }
}
