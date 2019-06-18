"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class PremiumComponent {
    constructor(i18nService, platformUtilsService, tokenService, apiService) {
        this.i18nService = i18nService;
        this.platformUtilsService = platformUtilsService;
        this.tokenService = tokenService;
        this.apiService = apiService;
        this.isPremium = false;
        this.price = 10;
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isPremium = this.tokenService.getPremium();
        });
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.refreshPromise = this.apiService.refreshIdentityToken();
                yield this.refreshPromise;
                this.platformUtilsService.showToast('success', null, this.i18nService.t('refreshComplete'));
                this.isPremium = this.tokenService.getPremium();
            }
            catch (_a) { }
        });
    }
    purchase() {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmed = yield this.platformUtilsService.showDialog(this.i18nService.t('premiumPurchaseAlert'), this.i18nService.t('premiumPurchase'), this.i18nService.t('yes'), this.i18nService.t('cancel'));
            if (confirmed) {
                this.platformUtilsService.eventTrack('Clicked Purchase Premium');
                this.platformUtilsService.launchUri('https://vault.bitwarden.com/#/?premium=purchase');
            }
        });
    }
    manage() {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmed = yield this.platformUtilsService.showDialog(this.i18nService.t('premiumManageAlert'), this.i18nService.t('premiumManage'), this.i18nService.t('yes'), this.i18nService.t('cancel'));
            if (confirmed) {
                this.platformUtilsService.eventTrack('Clicked Manage Membership');
                this.platformUtilsService.launchUri('https://vault.bitwarden.com/#/?premium=manage');
            }
        });
    }
}
exports.PremiumComponent = PremiumComponent;
//# sourceMappingURL=premium.component.js.map