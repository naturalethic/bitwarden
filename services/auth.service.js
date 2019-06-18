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
const twoFactorProviderType_1 = require("../enums/twoFactorProviderType");
const authResult_1 = require("../models/domain/authResult");
const deviceRequest_1 = require("../models/request/deviceRequest");
const keysRequest_1 = require("../models/request/keysRequest");
const preloginRequest_1 = require("../models/request/preloginRequest");
const tokenRequest_1 = require("../models/request/tokenRequest");
exports.TwoFactorProviders = {
    [twoFactorProviderType_1.TwoFactorProviderType.Authenticator]: {
        type: twoFactorProviderType_1.TwoFactorProviderType.Authenticator,
        name: null,
        description: null,
        priority: 1,
        sort: 1,
        premium: false,
    },
    [twoFactorProviderType_1.TwoFactorProviderType.Yubikey]: {
        type: twoFactorProviderType_1.TwoFactorProviderType.Yubikey,
        name: null,
        description: null,
        priority: 3,
        sort: 2,
        premium: true,
    },
    [twoFactorProviderType_1.TwoFactorProviderType.Duo]: {
        type: twoFactorProviderType_1.TwoFactorProviderType.Duo,
        name: 'Duo',
        description: null,
        priority: 2,
        sort: 3,
        premium: true,
    },
    [twoFactorProviderType_1.TwoFactorProviderType.OrganizationDuo]: {
        type: twoFactorProviderType_1.TwoFactorProviderType.OrganizationDuo,
        name: 'Duo (Organization)',
        description: null,
        priority: 10,
        sort: 4,
        premium: false,
    },
    [twoFactorProviderType_1.TwoFactorProviderType.U2f]: {
        type: twoFactorProviderType_1.TwoFactorProviderType.U2f,
        name: null,
        description: null,
        priority: 4,
        sort: 5,
        premium: true,
    },
    [twoFactorProviderType_1.TwoFactorProviderType.Email]: {
        type: twoFactorProviderType_1.TwoFactorProviderType.Email,
        name: null,
        description: null,
        priority: 0,
        sort: 6,
        premium: false,
    },
};
class AuthService {
    constructor(cryptoService, apiService, userService, tokenService, appIdService, i18nService, platformUtilsService, messagingService, setCryptoKeys = true) {
        this.cryptoService = cryptoService;
        this.apiService = apiService;
        this.userService = userService;
        this.tokenService = tokenService;
        this.appIdService = appIdService;
        this.i18nService = i18nService;
        this.platformUtilsService = platformUtilsService;
        this.messagingService = messagingService;
        this.setCryptoKeys = setCryptoKeys;
        this.selectedTwoFactorProviderType = null;
    }
    init() {
        exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.Email].name = this.i18nService.t('emailTitle');
        exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.Email].description = this.i18nService.t('emailDesc');
        exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.Authenticator].name = this.i18nService.t('authenticatorAppTitle');
        exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.Authenticator].description =
            this.i18nService.t('authenticatorAppDesc');
        exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.Duo].description = this.i18nService.t('duoDesc');
        exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.OrganizationDuo].name =
            'Duo (' + this.i18nService.t('organization') + ')';
        exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.OrganizationDuo].description =
            this.i18nService.t('duoOrganizationDesc');
        exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.U2f].name = this.i18nService.t('u2fTitle');
        exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.U2f].description = this.i18nService.t('u2fDesc');
        exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.Yubikey].name = this.i18nService.t('yubiKeyTitle');
        exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.Yubikey].description = this.i18nService.t('yubiKeyDesc');
    }
    logIn(email, masterPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            this.selectedTwoFactorProviderType = null;
            const key = yield this.makePreloginKey(masterPassword, email);
            const hashedPassword = yield this.cryptoService.hashPassword(masterPassword, key);
            return yield this.logInHelper(email, hashedPassword, key);
        });
    }
    logInTwoFactor(twoFactorProvider, twoFactorToken, remember) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.logInHelper(this.email, this.masterPasswordHash, this.key, twoFactorProvider, twoFactorToken, remember);
        });
    }
    logInComplete(email, masterPassword, twoFactorProvider, twoFactorToken, remember) {
        return __awaiter(this, void 0, void 0, function* () {
            this.selectedTwoFactorProviderType = null;
            const key = yield this.makePreloginKey(masterPassword, email);
            const hashedPassword = yield this.cryptoService.hashPassword(masterPassword, key);
            return yield this.logInHelper(email, hashedPassword, key, twoFactorProvider, twoFactorToken, remember);
        });
    }
    logOut(callback) {
        callback();
        this.messagingService.send('loggedOut');
    }
    getSupportedTwoFactorProviders(win) {
        const providers = [];
        if (this.twoFactorProvidersData == null) {
            return providers;
        }
        if (this.twoFactorProvidersData.has(twoFactorProviderType_1.TwoFactorProviderType.OrganizationDuo) &&
            this.platformUtilsService.supportsDuo()) {
            providers.push(exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.OrganizationDuo]);
        }
        if (this.twoFactorProvidersData.has(twoFactorProviderType_1.TwoFactorProviderType.Authenticator)) {
            providers.push(exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.Authenticator]);
        }
        if (this.twoFactorProvidersData.has(twoFactorProviderType_1.TwoFactorProviderType.Yubikey)) {
            providers.push(exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.Yubikey]);
        }
        if (this.twoFactorProvidersData.has(twoFactorProviderType_1.TwoFactorProviderType.Duo) && this.platformUtilsService.supportsDuo()) {
            providers.push(exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.Duo]);
        }
        if (this.twoFactorProvidersData.has(twoFactorProviderType_1.TwoFactorProviderType.U2f) && this.platformUtilsService.supportsU2f(win)) {
            providers.push(exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.U2f]);
        }
        if (this.twoFactorProvidersData.has(twoFactorProviderType_1.TwoFactorProviderType.Email)) {
            providers.push(exports.TwoFactorProviders[twoFactorProviderType_1.TwoFactorProviderType.Email]);
        }
        return providers;
    }
    getDefaultTwoFactorProvider(u2fSupported) {
        if (this.twoFactorProvidersData == null) {
            return null;
        }
        if (this.selectedTwoFactorProviderType != null &&
            this.twoFactorProvidersData.has(this.selectedTwoFactorProviderType)) {
            return this.selectedTwoFactorProviderType;
        }
        let providerType = null;
        let providerPriority = -1;
        this.twoFactorProvidersData.forEach((value, type) => {
            const provider = exports.TwoFactorProviders[type];
            if (provider != null && provider.priority > providerPriority) {
                if (type === twoFactorProviderType_1.TwoFactorProviderType.U2f && !u2fSupported) {
                    return;
                }
                providerType = type;
                providerPriority = provider.priority;
            }
        });
        return providerType;
    }
    makePreloginKey(masterPassword, email) {
        return __awaiter(this, void 0, void 0, function* () {
            email = email.trim().toLowerCase();
            this.kdf = null;
            this.kdfIterations = null;
            try {
                const preloginResponse = yield this.apiService.postPrelogin(new preloginRequest_1.PreloginRequest(email));
                if (preloginResponse != null) {
                    this.kdf = preloginResponse.kdf;
                    this.kdfIterations = preloginResponse.kdfIterations;
                }
            }
            catch (e) {
                if (e == null || e.statusCode !== 404) {
                    throw e;
                }
            }
            return this.cryptoService.makeKey(masterPassword, email, this.kdf, this.kdfIterations);
        });
    }
    logInHelper(email, hashedPassword, key, twoFactorProvider, twoFactorToken, remember) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedTwoFactorToken = yield this.tokenService.getTwoFactorToken(email);
            const appId = yield this.appIdService.getAppId();
            const deviceRequest = new deviceRequest_1.DeviceRequest(appId, this.platformUtilsService);
            let request;
            if (twoFactorToken != null && twoFactorProvider != null) {
                request = new tokenRequest_1.TokenRequest(email, hashedPassword, twoFactorProvider, twoFactorToken, remember, deviceRequest);
            }
            else if (storedTwoFactorToken != null) {
                request = new tokenRequest_1.TokenRequest(email, hashedPassword, twoFactorProviderType_1.TwoFactorProviderType.Remember, storedTwoFactorToken, false, deviceRequest);
            }
            else {
                request = new tokenRequest_1.TokenRequest(email, hashedPassword, null, null, false, deviceRequest);
            }
            const response = yield this.apiService.postIdentityToken(request);
            this.clearState();
            const result = new authResult_1.AuthResult();
            result.twoFactor = !response.accessToken;
            if (result.twoFactor) {
                // two factor required
                const twoFactorResponse = response;
                this.email = email;
                this.masterPasswordHash = hashedPassword;
                this.key = this.setCryptoKeys ? key : null;
                this.twoFactorProvidersData = twoFactorResponse.twoFactorProviders2;
                result.twoFactorProviders = twoFactorResponse.twoFactorProviders2;
                return result;
            }
            const tokenResponse = response;
            if (tokenResponse.twoFactorToken != null) {
                yield this.tokenService.setTwoFactorToken(tokenResponse.twoFactorToken, email);
            }
            yield this.tokenService.setTokens(tokenResponse.accessToken, tokenResponse.refreshToken);
            yield this.userService.setInformation(this.tokenService.getUserId(), this.tokenService.getEmail(), this.kdf, this.kdfIterations);
            if (this.setCryptoKeys) {
                yield this.cryptoService.setKey(key);
                yield this.cryptoService.setKeyHash(hashedPassword);
                yield this.cryptoService.setEncKey(tokenResponse.key);
                // User doesn't have a key pair yet (old account), let's generate one for them
                if (tokenResponse.privateKey == null) {
                    try {
                        const keyPair = yield this.cryptoService.makeKeyPair();
                        yield this.apiService.postAccountKeys(new keysRequest_1.KeysRequest(keyPair[0], keyPair[1].encryptedString));
                        tokenResponse.privateKey = keyPair[1].encryptedString;
                    }
                    catch (e) {
                        // tslint:disable-next-line
                        console.error(e);
                    }
                }
                yield this.cryptoService.setEncPrivateKey(tokenResponse.privateKey);
            }
            this.messagingService.send('loggedIn');
            return result;
        });
    }
    clearState() {
        this.email = null;
        this.masterPasswordHash = null;
        this.twoFactorProvidersData = null;
        this.selectedTwoFactorProviderType = null;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map