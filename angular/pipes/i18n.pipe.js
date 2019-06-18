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
const core_1 = require("@angular/core");
const i18n_service_1 = require("../../abstractions/i18n.service");
let I18nPipe = class I18nPipe {
    constructor(i18nService) {
        this.i18nService = i18nService;
    }
    transform(id, p1, p2, p3) {
        return this.i18nService.t(id, p1, p2, p3);
    }
};
I18nPipe = __decorate([
    core_1.Pipe({
        name: 'i18n',
    }),
    __metadata("design:paramtypes", [i18n_service_1.I18nService])
], I18nPipe);
exports.I18nPipe = I18nPipe;
//# sourceMappingURL=i18n.pipe.js.map