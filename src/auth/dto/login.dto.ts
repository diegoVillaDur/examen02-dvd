import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Nombre de usuario' })
  @IsString({ message: 'El username debe ser texto' })
  @IsNotEmpty({ message: 'El username es requerido' })
  username: string;

  @ApiProperty({ example: 'Admin@12345', description: 'Contraseña del usuario' })
  @IsString({ message: 'La contraseña debe ser texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;
}
