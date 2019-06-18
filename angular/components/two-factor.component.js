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
const deviceType_1 = require("../../enums/deviceType");
const twoFactorProviderType_1 = require("../../enums/twoFactorProviderType");
const twoFactorEmailRequest_1 = require("../../models/request/twoFactorEmailRequest");
const auth_service_1 = require("../../services/auth.service");
const DuoWebSDK = require("duo_web_sdk");
const u2f_1 = require("../../misc/u2f");
class TwoFactorComponent {
    constructor(authService, router, i18nService, apiService, platformUtilsService, win, environmentService) {
        this.authService = authService;
        this.router = router;
        this.i18nService = i18nService;
        this.apiService = apiService;
        this.platformUtilsService = platformUtilsService;
        this.win = win;
        this.environmentService = environmentService;
        this.token = '';
        this.remember = false;
        this.u2fReady = false;
        this.providers = auth_service_1.TwoFactorProviders;
        this.providerType = twoFactorProviderType_1.TwoFactorProviderType;
        this.selectedProviderType = twoFactorProviderType_1.TwoFactorProviderType.Authenticator;
        this.u2fSupported = false;
        this.u2f = null;
        this.title = '';
        this.twoFactorEmail = null;
        this.loginRoute = 'login';
        this.successRoute = 'vault';
        this.u2fSupported = this.platformUtilsService.supportsU2f(win);
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.authService.email == null || this.authService.masterPasswordHash == null ||
                this.authService.twoFactorProvidersData == null) {
                this.router.navigate([this.loginRoute]);
                return;
            }
            if (this.win != null && this.u2fSupported) {
                let customWebVaultUrl = null;
                if (this.environmentService.baseUrl != null) {
                    customWebVaultUrl = this.environmentService.baseUrl;
                }
                else if (this.environmentService.webVaultUrl != null) {
                    customWebVaultUrl = this.environmentService.webVaultUrl;
                }
                this.u2f = new u2f_1.U2f(this.win, customWebVaultUrl, (token) => {
                    this.token = token;
                    this.submit();
                }, (error) => {
                    this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), error);
                }, (info) => {
                    if (info === 'ready') {
                        this.u2fReady = true;
                    }
                });
            }
            this.selectedProviderType = this.authService.getDefaultTwoFactorProvider(this.u2fSupported);
            yield this.init();
        });
    }
    ngOnDestroy() {
        this.cleanupU2f();
        this.u2f = null;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.selectedProviderType == null) {
                this.title = this.i18nService.t('loginUnavailable');
                return;
            }
            this.cleanupU2f();
            this.title = auth_service_1.TwoFactorProviders[this.selectedProviderType].name;
            const providerData = this.authService.twoFactorProvidersData.get(this.selectedProviderType);
            switch (this.selectedProviderType) {
                case twoFactorProviderType_1.TwoFactorProviderType.U2f:
                    if (!this.u2fSupported || this.u2f == null) {
                        break;
                    }
                    if (providerData.Challenge != null) {
                        this.u2f.init(JSON.parse(providerData.Challenge));
                    }
                    else {
                        // TODO: Deprecated. Remove in future version.
                        const challenges = JSON.parse(providerData.Challenges);
                        if (challenges != null && challenges.length > 0) {
                            this.u2f.init({
                                appId: challenges[0].appId,
                                challenge: challenges[0].challenge,
                                keys: challenges.map((c) => {
                                    return {
                                        version: c.version,
                                        keyHandle: c.keyHandle,
                                    };
                                }),
                            });
                        }
                    }
                    break;
                case twoFactorProviderType_1.TwoFactorProviderType.Duo:
                case twoFactorProviderType_1.TwoFactorProviderType.OrganizationDuo:
                    if (this.platformUtilsService.getDevice() === deviceType_1.DeviceType.SafariExtension) {
                        break;
                    }
                    setTimeout(() => {
                        DuoWebSDK.init({
                            iframe: undefined,
                            host: providerData.Host,
                            sig_request: providerData.Signature,
                            submit_callback: (f) => __awaiter(this, void 0, void 0, function* () {
                                const sig = f.querySelector('input[name="sig_response"]');
                                if (sig != null) {
                                    this.token = sig.value;
                                    yield this.submit();
                                }
                            }),
                        });
                    }, 0);
                    break;
                case twoFactorProviderType_1.TwoFactorProviderType.Email:
                    this.twoFactorEmail = providerData.Email;
                    if (this.authService.twoFactorProvidersData.size > 1) {
                        yield this.sendEmail(false);
                    }
                    break;
                default:
                    break;
            }
        });
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.token == null || this.token === '') {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('verificationCodeRequired'));
                return;
            }
            if (this.selectedProviderType === twoFactorProviderType_1.TwoFactorProviderType.U2f) {
                if (this.u2f != null) {
                    this.u2f.stop();
                }
                else {
                    return;
                }
            }
            else if (this.selectedProviderType === twoFactorProviderType_1.TwoFactorProviderType.Email ||
                this.selectedProviderType === twoFactorProviderType_1.TwoFactorProviderType.Authenticator) {
                this.token = this.token.replace(' ', '').trim();
            }
            try {
                this.formPromise = this.authService.logInTwoFactor(this.selectedProviderType, this.token, this.remember);
                yield this.formPromise;
                if (this.onSuccessfulLogin != null) {
                    this.onSuccessfulLogin();
                }
                this.platformUtilsService.eventTrack('Logged In From Two-step');
                if (this.onSuccessfulLoginNavigate != null) {
                    this.onSuccessfulLoginNavigate();
                }
                else {
                    this.router.navigate([this.successRoute]);
                }
            }
            catch (_a) {
                if (this.selectedProviderType === twoFactorProviderType_1.TwoFactorProviderType.U2f && this.u2f != null) {
                    this.u2f.start();
                }
            }
        });
    }
    sendEmail(doToast) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.selectedProviderType !== twoFactorProviderType_1.TwoFactorProviderType.Email) {
                return;
            }
            if (this.emailPromise != null) {
                return;
            }
            try {
                const request = new twoFactorEmailRequest_1.TwoFactorEmailRequest(this.authService.email, this.authService.masterPasswordHash);
                this.emailPromise = this.apiService.postTwoFactorEmail(request);
                yield this.emailPromise;
                if (doToast) {
                    this.platformUtilsService.showToast('success', null, this.i18nService.t('verificationCodeEmailSent', this.twoFactorEmail));
                }
            }
            catch (_a) { }
            this.emailPromise = null;
        });
    }
    cleanupU2f() {
        if (this.u2f != null) {
            this.u2f.stop();
            this.u2f.cleanup();
        }
    }
}
exports.TwoFactorComponent = TwoFactorComponent;
//# sourceMappingURL=two-factor.component.js.map