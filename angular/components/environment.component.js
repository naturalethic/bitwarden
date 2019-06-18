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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
class EnvironmentComponent {
    constructor(platformUtilsService, environmentService, i18nService) {
        this.platformUtilsService = platformUtilsService;
        this.environmentService = environmentService;
        this.i18nService = i18nService;
        this.onSaved = new core_1.EventEmitter();
        this.showCustom = false;
        this.baseUrl = environmentService.baseUrl || '';
        this.webVaultUrl = environmentService.webVaultUrl || '';
        this.apiUrl = environmentService.apiUrl || '';
        this.identityUrl = environmentService.identityUrl || '';
        this.iconsUrl = environmentService.iconsUrl || '';
        this.notificationsUrl = environmentService.notificationsUrl || '';
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            const resUrls = yield this.environmentService.setUrls({
                base: this.baseUrl,
                api: this.apiUrl,
                identity: this.identityUrl,
                webVault: this.webVaultUrl,
                icons: this.iconsUrl,
                notifications: this.notificationsUrl,
            });
            // re-set urls since service can change them, ex: prefixing https://
            this.baseUrl = resUrls.base;
            this.apiUrl = resUrls.api;
            this.identityUrl = resUrls.identity;
            this.webVaultUrl = resUrls.webVault;
            this.iconsUrl = resUrls.icons;
            this.notificationsUrl = resUrls.notifications;
            this.platformUtilsService.eventTrack('Set Environment URLs');
            this.platformUtilsService.showToast('success', null, this.i18nService.t('environmentSaved'));
            this.saved();
        });
    }
    toggleCustom() {
        this.showCustom = !this.showCustom;
    }
    saved() {
        this.onSaved.emit();
    }
}
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], EnvironmentComponent.prototype, "onSaved", void 0);
exports.EnvironmentComponent = EnvironmentComponent;
//# sourceMappingURL=environment.component.js.map