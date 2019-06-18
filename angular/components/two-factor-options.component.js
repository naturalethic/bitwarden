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
class TwoFactorOptionsComponent {
    constructor(authService, router, i18nService, platformUtilsService, win) {
        this.authService = authService;
        this.router = router;
        this.i18nService = i18nService;
        this.platformUtilsService = platformUtilsService;
        this.win = win;
        this.onProviderSelected = new core_1.EventEmitter();
        this.onRecoverSelected = new core_1.EventEmitter();
        this.providers = [];
    }
    ngOnInit() {
        this.providers = this.authService.getSupportedTwoFactorProviders(this.win);
    }
    choose(p) {
        this.onProviderSelected.emit(p.type);
    }
    recover() {
        this.platformUtilsService.eventTrack('Selected Recover');
        this.platformUtilsService.launchUri('https://help.bitwarden.com/article/lost-two-step-device/');
        this.onRecoverSelected.emit();
    }
}
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], TwoFactorOptionsComponent.prototype, "onProviderSelected", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], TwoFactorOptionsComponent.prototype, "onRecoverSelected", void 0);
exports.TwoFactorOptionsComponent = TwoFactorOptionsComponent;
//# sourceMappingURL=two-factor-options.component.js.map