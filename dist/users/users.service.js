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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("./user.entity");
const role_enum_1 = require("../common/enums/role.enum");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    sanitize(user) {
        const { password, ...safe } = user;
        return safe;
    }
    async create(createUserDto) {
        const exists = await this.usersRepository.findOne({
            where: { username: createUserDto.username },
        });
        if (exists) {
            throw new common_1.ConflictException(`El username "${createUserDto.username}" ya está en uso`);
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({
            nombre: createUserDto.nombre,
            username: createUserDto.username,
            password: hashedPassword,
            role: role_enum_1.Role.USER,
        });
        const saved = await this.usersRepository.save(user);
        return this.sanitize(saved);
    }
    async findAll() {
        const users = await this.usersRepository.find();
        return users.map((u) => this.sanitize(u));
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con id "${id}" no encontrado`);
        }
        return this.sanitize(user);
    }
    async findByUsernameWithPassword(username) {
        return this.usersRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.username = :username', { username })
            .getOne();
    }
    async update(id, updateUserDto) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con id "${id}" no encontrado`);
        }
        if (updateUserDto.username && updateUserDto.username !== user.username) {
            const usernameExists = await this.usersRepository.findOne({
                where: { username: updateUserDto.username },
            });
            if (usernameExists) {
                throw new common_1.ConflictException(`El username "${updateUserDto.username}" ya está en uso`);
            }
        }
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        Object.assign(user, updateUserDto);
        const updated = await this.usersRepository.save(user);
        return this.sanitize(updated);
    }
    async remove(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con id "${id}" no encontrado`);
        }
        await this.usersRepository.remove(user);
        return { message: `Usuario "${user.username}" eliminado correctamente` };
    }
    async makeAdmin(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con id "${id}" no encontrado`);
        }
        user.role = role_enum_1.Role.ADMIN;
        const updated = await this.usersRepository.save(user);
        return this.sanitize(updated);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map