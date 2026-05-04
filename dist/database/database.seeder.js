"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DatabaseSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../users/user.entity");
const role_enum_1 = require("../common/enums/role.enum");
let DatabaseSeeder = DatabaseSeeder_1 = class DatabaseSeeder {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
        this.logger = new common_1.Logger(DatabaseSeeder_1.name);
    }
    async onModuleInit() {
        await this.seedAdmin();
    }
    async seedAdmin() {
        const adminExists = await this.usersRepository.findOne({
            where: { username: 'admin' },
        });
        if (adminExists) {
            this.logger.log('Usuario admin ya existe, omitiendo seed.');
            return;
        }
        const hashedPassword = await bcrypt.hash('Admin@12345', 10);
        const admin = this.usersRepository.create({
            nombre: 'Administrador del Sistema',
            username: 'admin',
            password: hashedPassword,
            role: role_enum_1.Role.ADMIN,
        });
        await this.usersRepository.save(admin);
        this.logger.log('✅ Usuario admin creado: username=admin | password=Admin@12345');
    }
};
exports.DatabaseSeeder = DatabaseSeeder;
exports.DatabaseSeeder = DatabaseSeeder = DatabaseSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DatabaseSeeder);
//# sourceMappingURL=database.seeder.js.map