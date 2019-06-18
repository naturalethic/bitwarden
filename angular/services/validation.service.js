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
const platformUtils_service_1 = require("../../abstractions/platformUtils.service");
let ValidationService = class ValidationService {
    constructor(i18nService, platformUtilsService) {
        this.i18nService = i18nService;
        this.platformUtilsService = platformUtilsService;
    }
    showError(data) {
        const defaultErrorMessage = this.i18nService.t('unexpectedError');
        let errors = [];
        if (data != null && typeof data === 'string') {
            errors.push(data);
        }
        else if (data == null || typeof data !== 'object') {
            errors.push(defaultErrorMessage);
        }
        else if (data.validationErrors != null) {
            errors = errors.concat(data.getAllMessages());
        }
        else {
            errors.push(data.message ? data.message : defaultErrorMessage);
        }
        if (errors.length === 1) {
            this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), errors[0]);
        }
        else if (errors.length > 1) {
            this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), errors, {
                timeout: 5000 * errors.length,
            });
        }
        return errors;
    }
};
ValidationService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [i18n_service_1.I18nService, platformUtils_service_1.PlatformUtilsService])
], ValidationService);
exports.ValidationService = ValidationService;
//# sourceMappingURL=validation.service.js.map