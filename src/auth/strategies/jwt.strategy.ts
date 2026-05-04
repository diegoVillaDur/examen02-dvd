import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  id: string;
  username: string;
  role: string;
}

/**
 * Estrategia JWT de Passport.
 * Extrae y valida el token del header Authorization: Bearer <token>
 * El resultado se inyecta en request.user por JwtAuthGuard.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.id || !payload.username || !payload.role) {
      throw new UnauthorizedException('Token malformado');
    }

    // Este objeto se convierte en request.user
    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
    };
  }
}
