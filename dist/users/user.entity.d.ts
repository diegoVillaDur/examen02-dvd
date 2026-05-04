import { Role } from '../common/enums/role.enum';
export declare class User {
    id: string;
    nombre: string;
    username: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
