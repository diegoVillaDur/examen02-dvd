import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';
interface JwtPayload {
    id: string;
    username: string;
    role: Role;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        nombre: string;
        username: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(currentUser: JwtPayload): Promise<{
        id: string;
        nombre: string;
        username: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    }> | Promise<{
        id: string;
        nombre: string;
        username: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        nombre: string;
        username: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    makeAdmin(id: string): Promise<{
        id: string;
        nombre: string;
        username: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
export {};
