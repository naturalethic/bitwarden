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
const utils_1 = require("../../misc/utils");
const Keys = {
    rememberedEmail: 'rememberedEmail',
    rememberEmail: 'rememberEmail',
};
class LoginComponent {
    constructor(authService, router, platformUtilsService, i18nService, storageService) {
        this.authService = authService;
        this.router = router;
        this.platformUtilsService = platformUtilsService;
        this.i18nService = i18nService;
        this.storageService = storageService;
        this.email = '';
        this.rememberEmail = true;
        this.masterPassword = '';
        this.showPassword = false;
        this.twoFactorRoute = '2fa';
        this.successRoute = 'vault';
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.email == null || this.email === '') {
                this.email = yield this.storageService.get(Keys.rememberedEmail);
                if (this.email == null) {
                    this.email = '';
                }
            }
            this.rememberEmail = yield this.storageService.get(Keys.rememberEmail);
            if (this.rememberEmail == null) {
                this.rememberEmail = true;
            }
            if (utils_1.Utils.isBrowser) {
                document.getElementById(this.email == null || this.email === '' ? 'email' : 'masterPassword').focus();
            }
        });
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.email == null || this.email === '') {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('emailRequired'));
                return;
            }
            if (this.email.indexOf('@') === -1) {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('invalidEmail'));
                return;
            }
            if (this.masterPassword == null || this.masterPassword === '') {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('masterPassRequired'));
                return;
            }
            try {
                this.formPromise = this.authService.logIn(this.email, this.masterPassword);
                const response = yield this.formPromise;
                yield this.storageService.save(Keys.rememberEmail, this.rememberEmail);
                if (this.rememberEmail) {
                    yield this.storageService.save(Keys.rememberedEmail, this.email);
                }
                else {
                    yield this.storageService.remove(Keys.rememberedEmail);
                }
                if (response.twoFactor) {
                    this.platformUtilsService.eventTrack('Logged In To Two-step');
                    if (this.onSuccessfulLoginTwoFactorNavigate != null) {
                        this.onSuccessfulLoginTwoFactorNavigate();
                    }
                    else {
                        this.router.navigate([this.twoFactorRoute]);
                    }
                }
                else {
                    if (this.onSuccessfulLogin != null) {
                        this.onSuccessfulLogin();
                    }
                    this.platformUtilsService.eventTrack('Logged In');
                    if (this.onSuccessfulLoginNavigate != null) {
                        this.onSuccessfulLoginNavigate();
                    }
                    else {
                        this.router.navigate([this.successRoute]);
                    }
                }
            }
            catch (_a) { }
        });
    }
    togglePassword() {
        this.platformUtilsService.eventTrack('Toggled Master Password on Login');
        this.showPassword = !this.showPassword;
        document.getElementById('masterPassword').focus();
    }
}
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], LoginComponent.prototype, "email", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], LoginComponent.prototype, "rememberEmail", void 0);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map