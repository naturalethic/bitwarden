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
const cipherType_1 = require("../../enums/cipherType");
const fieldType_1 = require("../../enums/fieldType");
const BroadcasterSubscriptionId = 'ViewComponent';
class ViewComponent {
    constructor(cipherService, totpService, tokenService, i18nService, cryptoService, platformUtilsService, auditService, win, broadcasterService, ngZone, changeDetectorRef, userService) {
        this.cipherService = cipherService;
        this.totpService = totpService;
        this.tokenService = tokenService;
        this.i18nService = i18nService;
        this.cryptoService = cryptoService;
        this.platformUtilsService = platformUtilsService;
        this.auditService = auditService;
        this.win = win;
        this.broadcasterService = broadcasterService;
        this.ngZone = ngZone;
        this.changeDetectorRef = changeDetectorRef;
        this.userService = userService;
        this.onEditCipher = new core_1.EventEmitter();
        this.fieldType = fieldType_1.FieldType;
    }
    ngOnInit() {
        this.broadcasterService.subscribe(BroadcasterSubscriptionId, (message) => {
            this.ngZone.run(() => __awaiter(this, void 0, void 0, function* () {
                switch (message.command) {
                    case 'syncCompleted':
                        if (message.successfully) {
                            yield this.load();
                            this.changeDetectorRef.detectChanges();
                        }
                        break;
                }
            }));
        });
    }
    ngOnDestroy() {
        this.broadcasterService.unsubscribe(BroadcasterSubscriptionId);
        this.cleanUp();
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cleanUp();
            const cipher = yield this.cipherService.get(this.cipherId);
            this.cipher = yield cipher.decrypt();
            this.canAccessPremium = yield this.userService.canAccessPremium();
            if (this.cipher.type === cipherType_1.CipherType.Login && this.cipher.login.totp &&
                (cipher.organizationUseTotp || this.canAccessPremium)) {
                yield this.totpUpdateCode();
                const interval = this.totpService.getTimeInterval(this.cipher.login.totp);
                yield this.totpTick(interval);
                this.totpInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.totpTick(interval);
                }), 1000);
            }
        });
    }
    edit() {
        this.onEditCipher.emit(this.cipher);
    }
    togglePassword() {
        this.platformUtilsService.eventTrack('Toggled Password');
        this.showPassword = !this.showPassword;
    }
    toggleCardCode() {
        this.platformUtilsService.eventTrack('Toggled Card Code');
        this.showCardCode = !this.showCardCode;
    }
    checkPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cipher.login == null || this.cipher.login.password == null || this.cipher.login.password === '') {
                return;
            }
            this.platformUtilsService.eventTrack('Check Password');
            this.checkPasswordPromise = this.auditService.passwordLeaked(this.cipher.login.password);
            const matches = yield this.checkPasswordPromise;
            if (matches > 0) {
                this.platformUtilsService.showToast('warning', null, this.i18nService.t('passwordExposed', matches.toString()));
            }
            else {
                this.platformUtilsService.showToast('success', null, this.i18nService.t('passwordSafe'));
            }
        });
    }
    toggleFieldValue(field) {
        const f = field;
        f.showValue = !f.showValue;
    }
    launch(uri) {
        if (!uri.canLaunch) {
            return;
        }
        this.platformUtilsService.eventTrack('Launched Login URI');
        this.platformUtilsService.launchUri(uri.launchUri);
    }
    copy(value, typeI18nKey, aType) {
        if (value == null) {
            return;
        }
        this.platformUtilsService.eventTrack('Copied ' + aType);
        const copyOptions = this.win != null ? { window: this.win } : null;
        this.platformUtilsService.copyToClipboard(value, copyOptions);
        this.platformUtilsService.showToast('info', null, this.i18nService.t('valueCopied', this.i18nService.t(typeI18nKey)));
    }
    downloadAttachment(attachment) {
        return __awaiter(this, void 0, void 0, function* () {
            const a = attachment;
            if (a.downloading) {
                return;
            }
            if (this.cipher.organizationId == null && !this.canAccessPremium) {
                this.platformUtilsService.showToast('error', this.i18nService.t('premiumRequired'), this.i18nService.t('premiumRequiredDesc'));
                return;
            }
            a.downloading = true;
            const response = yield fetch(new Request(attachment.url, { cache: 'no-cache' }));
            if (response.status !== 200) {
                this.platformUtilsService.showToast('error', null, this.i18nService.t('errorOccurred'));
                a.downloading = false;
                return;
            }
            try {
                const buf = yield response.arrayBuffer();
                const key = attachment.key != null ? attachment.key :
                    yield this.cryptoService.getOrgKey(this.cipher.organizationId);
                const decBuf = yield this.cryptoService.decryptFromBytes(buf, key);
                this.platformUtilsService.saveFile(this.win, decBuf, null, attachment.fileName);
            }
            catch (e) {
                this.platformUtilsService.showToast('error', null, this.i18nService.t('errorOccurred'));
            }
            a.downloading = false;
        });
    }
    cleanUp() {
        this.totpCode = null;
        this.cipher = null;
        this.showPassword = false;
        if (this.totpInterval) {
            clearInterval(this.totpInterval);
        }
    }
    totpUpdateCode() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cipher == null || this.cipher.type !== cipherType_1.CipherType.Login || this.cipher.login.totp == null) {
                if (this.totpInterval) {
                    clearInterval(this.totpInterval);
                }
                return;
            }
            this.totpCode = yield this.totpService.getCode(this.cipher.login.totp);
            if (this.totpCode != null) {
                if (this.totpCode.length > 4) {
                    const half = Math.floor(this.totpCode.length / 2);
                    this.totpCodeFormatted = this.totpCode.substring(0, half) + ' ' + this.totpCode.substring(half);
                }
                else {
                    this.totpCodeFormatted = this.totpCode;
                }
            }
            else {
                this.totpCodeFormatted = null;
                if (this.totpInterval) {
                    clearInterval(this.totpInterval);
                }
            }
        });
    }
    totpTick(intervalSeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            const epoch = Math.round(new Date().getTime() / 1000.0);
            const mod = epoch % intervalSeconds;
            this.totpSec = intervalSeconds - mod;
            this.totpDash = +(Math.round((((78.6 / intervalSeconds) * mod) + 'e+2')) + 'e-2');
            this.totpLow = this.totpSec <= 7;
            if (mod === 0) {
                yield this.totpUpdateCode();
            }
        });
    }
}
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ViewComponent.prototype, "cipherId", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ViewComponent.prototype, "onEditCipher", void 0);
exports.ViewComponent = ViewComponent;
//# sourceMappingURL=view.component.js.map