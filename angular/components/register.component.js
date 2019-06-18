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
const keysRequest_1 = require("../../models/request/keysRequest");
const registerRequest_1 = require("../../models/request/registerRequest");
const kdfType_1 = require("../../enums/kdfType");
class RegisterComponent {
    constructor(authService, router, i18nService, cryptoService, apiService, stateService, platformUtilsService, passwordGenerationService) {
        this.authService = authService;
        this.router = router;
        this.i18nService = i18nService;
        this.cryptoService = cryptoService;
        this.apiService = apiService;
        this.stateService = stateService;
        this.platformUtilsService = platformUtilsService;
        this.passwordGenerationService = passwordGenerationService;
        this.name = '';
        this.email = '';
        this.masterPassword = '';
        this.confirmMasterPassword = '';
        this.hint = '';
        this.showPassword = false;
        this.successRoute = 'login';
    }
    get masterPasswordScoreWidth() {
        return this.masterPasswordScore == null ? 0 : (this.masterPasswordScore + 1) * 20;
    }
    get masterPasswordScoreColor() {
        switch (this.masterPasswordScore) {
            case 4:
                return 'success';
            case 3:
                return 'primary';
            case 2:
                return 'warning';
            default:
                return 'danger';
        }
    }
    get masterPasswordScoreText() {
        switch (this.masterPasswordScore) {
            case 4:
                return this.i18nService.t('strong');
            case 3:
                return this.i18nService.t('good');
            case 2:
                return this.i18nService.t('weak');
            default:
                return this.masterPasswordScore != null ? this.i18nService.t('weak') : null;
        }
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
            if (this.masterPassword.length < 8) {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('masterPassLength'));
                return;
            }
            if (this.masterPassword !== this.confirmMasterPassword) {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('masterPassDoesntMatch'));
                return;
            }
            const strengthResult = this.passwordGenerationService.passwordStrength(this.masterPassword, this.getPasswordStrengthUserInput());
            if (strengthResult != null && strengthResult.score < 3) {
                const result = yield this.platformUtilsService.showDialog(this.i18nService.t('weakMasterPasswordDesc'), this.i18nService.t('weakMasterPassword'), this.i18nService.t('yes'), this.i18nService.t('no'), 'warning');
                if (!result) {
                    return;
                }
            }
            this.name = this.name === '' ? null : this.name;
            this.email = this.email.trim().toLowerCase();
            const kdf = kdfType_1.KdfType.PBKDF2_SHA256;
            const useLowerKdf = this.platformUtilsService.isEdge() || this.platformUtilsService.isIE();
            const kdfIterations = useLowerKdf ? 10000 : 100000;
            const key = yield this.cryptoService.makeKey(this.masterPassword, this.email, kdf, kdfIterations);
            const encKey = yield this.cryptoService.makeEncKey(key);
            const hashedPassword = yield this.cryptoService.hashPassword(this.masterPassword, key);
            const keys = yield this.cryptoService.makeKeyPair(encKey[0]);
            const request = new registerRequest_1.RegisterRequest(this.email, this.name, hashedPassword, this.hint, encKey[1].encryptedString, kdf, kdfIterations);
            request.keys = new keysRequest_1.KeysRequest(keys[0], keys[1].encryptedString);
            const orgInvite = yield this.stateService.get('orgInvitation');
            if (orgInvite != null && orgInvite.token != null && orgInvite.organizationUserId != null) {
                request.token = orgInvite.token;
                request.organizationUserId = orgInvite.organizationUserId;
            }
            try {
                this.formPromise = this.apiService.postRegister(request);
                yield this.formPromise;
                this.platformUtilsService.eventTrack('Registered');
                this.platformUtilsService.showToast('success', null, this.i18nService.t('newAccountCreated'));
                this.router.navigate([this.successRoute], { queryParams: { email: this.email } });
            }
            catch (_a) { }
        });
    }
    togglePassword(confirmField) {
        this.platformUtilsService.eventTrack('Toggled Master Password on Register');
        this.showPassword = !this.showPassword;
        document.getElementById(confirmField ? 'masterPasswordRetype' : 'masterPassword').focus();
    }
    updatePasswordStrength() {
        if (this.masterPasswordStrengthTimeout != null) {
            clearTimeout(this.masterPasswordStrengthTimeout);
        }
        this.masterPasswordStrengthTimeout = setTimeout(() => {
            const strengthResult = this.passwordGenerationService.passwordStrength(this.masterPassword, this.getPasswordStrengthUserInput());
            this.masterPasswordScore = strengthResult == null ? null : strengthResult.score;
        }, 300);
    }
    getPasswordStrengthUserInput() {
        let userInput = [];
        const atPosition = this.email.indexOf('@');
        if (atPosition > -1) {
            userInput = userInput.concat(this.email.substr(0, atPosition).trim().toLowerCase().split(/[^A-Za-z0-9]/));
        }
        if (this.name != null && this.name !== '') {
            userInput = userInput.concat(this.name.trim().toLowerCase().split(' '));
        }
        return userInput;
    }
}
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map