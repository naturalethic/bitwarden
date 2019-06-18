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
const constants_service_1 = require("../../services/constants.service");
const cipherString_1 = require("../../models/domain/cipherString");
const utils_1 = require("../../misc/utils");
class LockComponent {
    constructor(router, i18nService, platformUtilsService, messagingService, userService, cryptoService, storageService, lockService, environmentService) {
        this.router = router;
        this.i18nService = i18nService;
        this.platformUtilsService = platformUtilsService;
        this.messagingService = messagingService;
        this.userService = userService;
        this.cryptoService = cryptoService;
        this.storageService = storageService;
        this.lockService = lockService;
        this.environmentService = environmentService;
        this.masterPassword = '';
        this.pin = '';
        this.showPassword = false;
        this.pinLock = false;
        this.webVaultHostname = '';
        this.successRoute = 'vault';
        this.invalidPinAttempts = 0;
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.pinSet = yield this.lockService.isPinLockSet();
            const hasKey = yield this.cryptoService.hasKey();
            this.pinLock = (this.pinSet[0] && hasKey) || this.pinSet[1];
            this.email = yield this.userService.getEmail();
            let vaultUrl = this.environmentService.getWebVaultUrl();
            if (vaultUrl == null) {
                vaultUrl = 'https://bitwarden.com';
            }
            this.webVaultHostname = utils_1.Utils.getHostname(vaultUrl);
        });
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pinLock && (this.pin == null || this.pin === '')) {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('pinRequired'));
                return;
            }
            if (!this.pinLock && (this.masterPassword == null || this.masterPassword === '')) {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('masterPassRequired'));
                return;
            }
            const kdf = yield this.userService.getKdf();
            const kdfIterations = yield this.userService.getKdfIterations();
            if (this.pinLock) {
                let failed = true;
                try {
                    if (this.pinSet[0]) {
                        const protectedPin = yield this.storageService.get(constants_service_1.ConstantsService.protectedPin);
                        const decPin = yield this.cryptoService.decryptToUtf8(new cipherString_1.CipherString(protectedPin));
                        failed = decPin !== this.pin;
                        this.lockService.pinLocked = failed;
                        if (!failed) {
                            this.doContinue();
                        }
                    }
                    else {
                        const key = yield this.cryptoService.makeKeyFromPin(this.pin, this.email, kdf, kdfIterations);
                        failed = false;
                        yield this.setKeyAndContinue(key);
                    }
                }
                catch (_a) {
                    failed = true;
                }
                if (failed) {
                    this.invalidPinAttempts++;
                    if (this.invalidPinAttempts >= 5) {
                        this.messagingService.send('logout');
                        return;
                    }
                    this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('invalidPin'));
                }
            }
            else {
                const key = yield this.cryptoService.makeKey(this.masterPassword, this.email, kdf, kdfIterations);
                const keyHash = yield this.cryptoService.hashPassword(this.masterPassword, key);
                const storedKeyHash = yield this.cryptoService.getKeyHash();
                if (storedKeyHash != null && keyHash != null && storedKeyHash === keyHash) {
                    this.setKeyAndContinue(key);
                }
                else {
                    this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('invalidMasterPassword'));
                }
            }
        });
    }
    logOut() {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmed = yield this.platformUtilsService.showDialog(this.i18nService.t('logOutConfirmation'), this.i18nService.t('logOut'), this.i18nService.t('logOut'), this.i18nService.t('cancel'));
            if (confirmed) {
                this.messagingService.send('logout');
            }
        });
    }
    togglePassword() {
        this.platformUtilsService.eventTrack('Toggled Master Password on Unlock');
        this.showPassword = !this.showPassword;
        document.getElementById(this.pinLock ? 'pin' : 'masterPassword').focus();
    }
    setKeyAndContinue(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cryptoService.setKey(key);
            this.doContinue();
        });
    }
    doContinue() {
        this.messagingService.send('unlocked');
        if (this.onSuccessfulSubmit != null) {
            this.onSuccessfulSubmit();
        }
        else if (this.router != null) {
            this.router.navigate([this.successRoute]);
        }
    }
}
exports.LockComponent = LockComponent;
//# sourceMappingURL=lock.component.js.map