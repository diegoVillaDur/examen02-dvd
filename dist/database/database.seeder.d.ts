import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
export declare class DatabaseSeeder implements OnModuleInit {
    private readonly usersRepository;
    private readonly logger;
    constructor(usersRepository: Repository<User>);
    onModuleInit(): Promise<void>;
    private seedAdmin;
}
