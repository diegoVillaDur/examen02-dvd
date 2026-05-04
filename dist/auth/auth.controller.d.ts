import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            nombre: string;
            username: string;
            role: import("../common/enums/role.enum").Role;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        token_type: string;
        user: {
            id: string;
            nombre: string;
            username: string;
            role: import("../common/enums/role.enum").Role;
        };
    }>;
}
