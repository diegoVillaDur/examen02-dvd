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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Juan Pérez', description: 'Nombre completo del usuario' }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El nombre no puede exceder 100 caracteres' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'juanperez', description: 'Nombre de usuario único (solo letras, números y _)' }),
    (0, class_validator_1.IsString)({ message: 'El username debe ser texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El username es requerido' }),
    (0, class_validator_1.MinLength)(3, { message: 'El username debe tener al menos 3 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'El username no puede exceder 50 caracteres' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9_]+$/, {
        message: 'El username solo puede contener letras, números y guiones bajos',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456', description: 'Contraseña (mínimo 6 caracteres)', minLength: 6 }),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es requerida' }),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'La contraseña no puede exceder 50 caracteres' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
//# sourceMappingURL=register.dto.js.map