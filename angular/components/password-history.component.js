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
class PasswordHistoryComponent {
    constructor(cipherService, platformUtilsService, i18nService, win) {
        this.cipherService = cipherService;
        this.platformUtilsService = platformUtilsService;
        this.i18nService = i18nService;
        this.win = win;
        this.history = [];
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
        });
    }
    copy(password) {
        this.platformUtilsService.eventTrack('Copied Password History');
        const copyOptions = this.win != null ? { window: this.win } : null;
        this.platformUtilsService.copyToClipboard(password, copyOptions);
        this.platformUtilsService.showToast('info', null, this.i18nService.t('valueCopied', this.i18nService.t('password')));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const cipher = yield this.cipherService.get(this.cipherId);
            const decCipher = yield cipher.decrypt();
            this.history = decCipher.passwordHistory == null ? [] : decCipher.passwordHistory;
        });
    }
}
exports.PasswordHistoryComponent = PasswordHistoryComponent;
//# sourceMappingURL=password-history.component.js.map