import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
type SafeUser = Omit<User, 'password'>;
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    private sanitize;
    create(createUserDto: CreateUserDto): Promise<SafeUser>;
    findAll(): Promise<SafeUser[]>;
    findOne(id: string): Promise<SafeUser>;
    findByUsernameWithPassword(username: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<SafeUser>;
    remove(id: string): Promise<{
        message: string;
    }>;
    makeAdmin(id: string): Promise<SafeUser>;
}
export {};
