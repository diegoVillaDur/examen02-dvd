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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const userExample = { id: 'uuid', nombre: 'Juan Pérez', username: 'juanperez', role: 'USER', createdAt: '2026-05-04T00:00:00.000Z' };
const unauthorizedExample = { statusCode: 401, message: 'Token inválido o ausente. Por favor inicia sesión.', error: 'Unauthorized' };
const forbiddenExample = { statusCode: 403, message: 'Acceso denegado. Se requiere uno de los siguientes roles: DEVELOPER', error: 'Forbidden' };
const notFoundExample = { statusCode: 404, message: 'Usuario con id "uuid" no encontrado', error: 'Not Found' };
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    findAll(currentUser) {
        if (currentUser.role === role_enum_1.Role.USER) {
            return this.usersService.findOne(currentUser.id);
        }
        return this.usersService.findAll();
    }
    update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    makeAdmin(id) {
        return this.usersService.makeAdmin(id);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.DEVELOPER),
    (0, swagger_1.ApiOperation)({ summary: 'Crear usuario', description: 'Solo DEVELOPER puede crear usuarios. El rol siempre será USER.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario creado', schema: { example: userExample } }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos', schema: { example: { statusCode: 400, message: ['El username es requerido'], error: 'Bad Request' } } }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autenticado', schema: { example: unauthorizedExample } }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sin permisos (requiere DEVELOPER)', schema: { example: forbiddenExample } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar usuarios', description: 'ADMIN/DEVELOPER: todos los usuarios. USER: solo su propio perfil.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de usuarios (o perfil propio si rol=USER)', schema: { example: [userExample] } }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autenticado', schema: { example: unauthorizedExample } }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.DEVELOPER),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar usuario', description: 'Solo DEVELOPER. Todos los campos son opcionales.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID del usuario', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario actualizado', schema: { example: userExample } }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos', schema: { example: { statusCode: 400, message: ['El username ya está en uso'], error: 'Bad Request' } } }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autenticado', schema: { example: unauthorizedExample } }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sin permisos (requiere DEVELOPER)', schema: { example: { ...forbiddenExample, message: 'Acceso denegado. Se requiere uno de los siguientes roles: DEVELOPER' } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/make-admin'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Promover a ADMIN', description: 'Solo ADMIN puede promover a otro usuario al rol ADMIN.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID del usuario a promover', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario promovido a ADMIN', schema: { example: { ...userExample, role: 'ADMIN' } } }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autenticado', schema: { example: unauthorizedExample } }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sin permisos (requiere ADMIN)', schema: { example: { ...forbiddenExample, message: 'Acceso denegado. Se requiere uno de los siguientes roles: ADMIN' } } }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado', schema: { example: notFoundExample } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "makeAdmin", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar usuario', description: 'Solo ADMIN puede eliminar usuarios.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID del usuario a eliminar', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario eliminado', schema: { example: { message: 'Usuario "juanperez" eliminado correctamente' } } }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autenticado', schema: { example: unauthorizedExample } }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sin permisos (requiere ADMIN)', schema: { example: { ...forbiddenExample, message: 'Acceso denegado. Se requiere uno de los siguientes roles: ADMIN' } } }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado', schema: { example: notFoundExample } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map