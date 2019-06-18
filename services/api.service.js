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
const deviceType_1 = require("../enums/deviceType");
const apiKeyResponse_1 = require("../models/response/apiKeyResponse");
const billingResponse_1 = require("../models/response/billingResponse");
const breachAccountResponse_1 = require("../models/response/breachAccountResponse");
const cipherResponse_1 = require("../models/response/cipherResponse");
const collectionResponse_1 = require("../models/response/collectionResponse");
const domainsResponse_1 = require("../models/response/domainsResponse");
const errorResponse_1 = require("../models/response/errorResponse");
const eventResponse_1 = require("../models/response/eventResponse");
const folderResponse_1 = require("../models/response/folderResponse");
const groupResponse_1 = require("../models/response/groupResponse");
const identityTokenResponse_1 = require("../models/response/identityTokenResponse");
const identityTwoFactorResponse_1 = require("../models/response/identityTwoFactorResponse");
const listResponse_1 = require("../models/response/listResponse");
const organizationResponse_1 = require("../models/response/organizationResponse");
const organizationSubscriptionResponse_1 = require("../models/response/organizationSubscriptionResponse");
const organizationUserResponse_1 = require("../models/response/organizationUserResponse");
const preloginResponse_1 = require("../models/response/preloginResponse");
const profileResponse_1 = require("../models/response/profileResponse");
const selectionReadOnlyResponse_1 = require("../models/response/selectionReadOnlyResponse");
const subscriptionResponse_1 = require("../models/response/subscriptionResponse");
const syncResponse_1 = require("../models/response/syncResponse");
const twoFactorAuthenticatorResponse_1 = require("../models/response/twoFactorAuthenticatorResponse");
const twoFactorDuoResponse_1 = require("../models/response/twoFactorDuoResponse");
const twoFactorEmailResponse_1 = require("../models/response/twoFactorEmailResponse");
const twoFactorProviderResponse_1 = require("../models/response/twoFactorProviderResponse");
const twoFactorRescoverResponse_1 = require("../models/response/twoFactorRescoverResponse");
const twoFactorU2fResponse_1 = require("../models/response/twoFactorU2fResponse");
const twoFactorYubiKeyResponse_1 = require("../models/response/twoFactorYubiKeyResponse");
const userKeyResponse_1 = require("../models/response/userKeyResponse");
class ApiService {
    constructor(tokenService, platformUtilsService, logoutCallback) {
        this.tokenService = tokenService;
        this.platformUtilsService = platformUtilsService;
        this.logoutCallback = logoutCallback;
        this.urlsSet = false;
        this.isWebClient = false;
        this.isDesktopClient = false;
        this.usingBaseUrl = false;
        const device = platformUtilsService.getDevice();
        this.deviceType = device.toString();
        this.isWebClient = device === deviceType_1.DeviceType.IEBrowser || device === deviceType_1.DeviceType.ChromeBrowser ||
            device === deviceType_1.DeviceType.EdgeBrowser || device === deviceType_1.DeviceType.FirefoxBrowser ||
            device === deviceType_1.DeviceType.OperaBrowser || device === deviceType_1.DeviceType.SafariBrowser ||
            device === deviceType_1.DeviceType.UnknownBrowser || device === deviceType_1.DeviceType.VivaldiBrowser;
        this.isDesktopClient = device === deviceType_1.DeviceType.WindowsDesktop || device === deviceType_1.DeviceType.MacOsDesktop ||
            device === deviceType_1.DeviceType.LinuxDesktop;
    }
    setUrls(urls) {
        this.urlsSet = true;
        if (urls.base != null) {
            this.usingBaseUrl = true;
            this.apiBaseUrl = urls.base + '/api';
            this.identityBaseUrl = urls.base + '/identity';
            return;
        }
        if (urls.api != null && urls.identity != null) {
            this.apiBaseUrl = urls.api;
            this.identityBaseUrl = urls.identity;
            return;
        }
        /* tslint:disable */
        // Local Dev
        //this.apiBaseUrl = 'http://localhost:4000';
        //this.identityBaseUrl = 'http://localhost:33656';
        // Production
        this.apiBaseUrl = 'https://api.bitwarden.com';
        this.identityBaseUrl = 'https://identity.bitwarden.com';
        /* tslint:enable */
    }
    // Auth APIs
    postIdentityToken(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.fetch(new Request(this.identityBaseUrl + '/connect/token', {
                body: this.qsStringify(request.toIdentityToken(this.platformUtilsService.identityClientId)),
                credentials: this.getCredentials(),
                cache: 'no-cache',
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Accept': 'application/json',
                    'Device-Type': this.deviceType,
                }),
                method: 'POST',
            }));
            let responseJson = null;
            if (this.isJsonResponse(response)) {
                responseJson = yield response.json();
            }
            if (responseJson != null) {
                if (response.status === 200) {
                    return new identityTokenResponse_1.IdentityTokenResponse(responseJson);
                }
                else if (response.status === 400 && responseJson.TwoFactorProviders2 &&
                    Object.keys(responseJson.TwoFactorProviders2).length) {
                    yield this.tokenService.clearTwoFactorToken(request.email);
                    return new identityTwoFactorResponse_1.IdentityTwoFactorResponse(responseJson);
                }
            }
            return Promise.reject(new errorResponse_1.ErrorResponse(responseJson, response.status, true));
        });
    }
    refreshIdentityToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.doRefreshToken();
            }
            catch (e) {
                return Promise.reject(null);
            }
        });
    }
    // Account APIs
    getProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/accounts/profile', null, true, true);
            return new profileResponse_1.ProfileResponse(r);
        });
    }
    getUserBilling() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/accounts/billing', null, true, true);
            return new billingResponse_1.BillingResponse(r);
        });
    }
    getUserSubscription() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/accounts/subscription', null, true, true);
            return new subscriptionResponse_1.SubscriptionResponse(r);
        });
    }
    putProfile(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/accounts/profile', request, true, true);
            return new profileResponse_1.ProfileResponse(r);
        });
    }
    postPrelogin(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/accounts/prelogin', request, false, true);
            return new preloginResponse_1.PreloginResponse(r);
        });
    }
    postEmailToken(request) {
        return this.send('POST', '/accounts/email-token', request, true, false);
    }
    postEmail(request) {
        return this.send('POST', '/accounts/email', request, true, false);
    }
    postPassword(request) {
        return this.send('POST', '/accounts/password', request, true, false);
    }
    postSecurityStamp(request) {
        return this.send('POST', '/accounts/security-stamp', request, true, false);
    }
    deleteAccount(request) {
        return this.send('DELETE', '/accounts', request, true, false);
    }
    getAccountRevisionDate() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/accounts/revision-date', null, true, true);
            return r;
        });
    }
    postPasswordHint(request) {
        return this.send('POST', '/accounts/password-hint', request, false, false);
    }
    postRegister(request) {
        return this.send('POST', '/accounts/register', request, false, false);
    }
    postPremium(data) {
        return this.send('POST', '/accounts/premium', data, true, false);
    }
    postReinstatePremium() {
        return this.send('POST', '/accounts/reinstate-premium', null, true, false);
    }
    postCancelPremium() {
        return this.send('POST', '/accounts/cancel-premium', null, true, false);
    }
    postAccountStorage(request) {
        return this.send('POST', '/accounts/storage', request, true, false);
    }
    postAccountPayment(request) {
        return this.send('POST', '/accounts/payment', request, true, false);
    }
    postAccountLicense(data) {
        return this.send('POST', '/accounts/license', data, true, false);
    }
    postAccountKeys(request) {
        return this.send('POST', '/accounts/keys', request, true, false);
    }
    postAccountKey(request) {
        return this.send('POST', '/accounts/key', request, true, false);
    }
    postAccountVerifyEmail() {
        return this.send('POST', '/accounts/verify-email', null, true, false);
    }
    postAccountVerifyEmailToken(request) {
        return this.send('POST', '/accounts/verify-email-token', request, false, false);
    }
    postAccountRecoverDelete(request) {
        return this.send('POST', '/accounts/delete-recover', request, false, false);
    }
    postAccountRecoverDeleteToken(request) {
        return this.send('POST', '/accounts/delete-recover-token', request, false, false);
    }
    postAccountKdf(request) {
        return this.send('POST', '/accounts/kdf', request, true, false);
    }
    // Folder APIs
    getFolder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/folders/' + id, null, true, true);
            return new folderResponse_1.FolderResponse(r);
        });
    }
    postFolder(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/folders', request, true, true);
            return new folderResponse_1.FolderResponse(r);
        });
    }
    putFolder(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/folders/' + id, request, true, true);
            return new folderResponse_1.FolderResponse(r);
        });
    }
    deleteFolder(id) {
        return this.send('DELETE', '/folders/' + id, null, true, false);
    }
    // Cipher APIs
    getCipher(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/ciphers/' + id, null, true, true);
            return new cipherResponse_1.CipherResponse(r);
        });
    }
    getCipherAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/ciphers/' + id + '/admin', null, true, true);
            return new cipherResponse_1.CipherResponse(r);
        });
    }
    getCiphersOrganization(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/ciphers/organization-details?organizationId=' + organizationId, null, true, true);
            return new listResponse_1.ListResponse(r, cipherResponse_1.CipherResponse);
        });
    }
    postCipher(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/ciphers', request, true, true);
            return new cipherResponse_1.CipherResponse(r);
        });
    }
    postCipherCreate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/ciphers/create', request, true, true);
            return new cipherResponse_1.CipherResponse(r);
        });
    }
    postCipherAdmin(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/ciphers/admin', request, true, true);
            return new cipherResponse_1.CipherResponse(r);
        });
    }
    putCipher(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/ciphers/' + id, request, true, true);
            return new cipherResponse_1.CipherResponse(r);
        });
    }
    putCipherAdmin(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/ciphers/' + id + '/admin', request, true, true);
            return new cipherResponse_1.CipherResponse(r);
        });
    }
    deleteCipher(id) {
        return this.send('DELETE', '/ciphers/' + id, null, true, false);
    }
    deleteCipherAdmin(id) {
        return this.send('DELETE', '/ciphers/' + id + '/admin', null, true, false);
    }
    deleteManyCiphers(request) {
        return this.send('DELETE', '/ciphers', request, true, false);
    }
    putMoveCiphers(request) {
        return this.send('PUT', '/ciphers/move', request, true, false);
    }
    putShareCipher(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/ciphers/' + id + '/share', request, true, true);
            return new cipherResponse_1.CipherResponse(r);
        });
    }
    putShareCiphers(request) {
        return this.send('PUT', '/ciphers/share', request, true, false);
    }
    putCipherCollections(id, request) {
        return this.send('PUT', '/ciphers/' + id + '/collections', request, true, false);
    }
    putCipherCollectionsAdmin(id, request) {
        return this.send('PUT', '/ciphers/' + id + '/collections-admin', request, true, false);
    }
    postPurgeCiphers(request, organizationId = null) {
        let path = '/ciphers/purge';
        if (organizationId != null) {
            path += '?organizationId=' + organizationId;
        }
        return this.send('POST', path, request, true, false);
    }
    postImportCiphers(request) {
        return this.send('POST', '/ciphers/import', request, true, false);
    }
    postImportOrganizationCiphers(organizationId, request) {
        return this.send('POST', '/ciphers/import-organization?organizationId=' + organizationId, request, true, false);
    }
    // Attachments APIs
    postCipherAttachment(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/ciphers/' + id + '/attachment', data, true, true);
            return new cipherResponse_1.CipherResponse(r);
        });
    }
    postCipherAttachmentAdmin(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/ciphers/' + id + '/attachment-admin', data, true, true);
            return new cipherResponse_1.CipherResponse(r);
        });
    }
    deleteCipherAttachment(id, attachmentId) {
        return this.send('DELETE', '/ciphers/' + id + '/attachment/' + attachmentId, null, true, false);
    }
    deleteCipherAttachmentAdmin(id, attachmentId) {
        return this.send('DELETE', '/ciphers/' + id + '/attachment/' + attachmentId + '/admin', null, true, false);
    }
    postShareCipherAttachment(id, attachmentId, data, organizationId) {
        return this.send('POST', '/ciphers/' + id + '/attachment/' +
            attachmentId + '/share?organizationId=' + organizationId, data, true, false);
    }
    // Collections APIs
    getCollectionDetails(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/organizations/' + organizationId + '/collections/' + id + '/details', null, true, true);
            return new collectionResponse_1.CollectionGroupDetailsResponse(r);
        });
    }
    getUserCollections() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/collections', null, true, true);
            return new listResponse_1.ListResponse(r, collectionResponse_1.CollectionResponse);
        });
    }
    getCollections(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/organizations/' + organizationId + '/collections', null, true, true);
            return new listResponse_1.ListResponse(r, collectionResponse_1.CollectionResponse);
        });
    }
    getCollectionUsers(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/organizations/' + organizationId + '/collections/' + id + '/users', null, true, true);
            return r.map((dr) => new selectionReadOnlyResponse_1.SelectionReadOnlyResponse(dr));
        });
    }
    postCollection(organizationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/organizations/' + organizationId + '/collections', request, true, true);
            return new collectionResponse_1.CollectionResponse(r);
        });
    }
    putCollection(organizationId, id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/organizations/' + organizationId + '/collections/' + id, request, true, true);
            return new collectionResponse_1.CollectionResponse(r);
        });
    }
    putCollectionUsers(organizationId, id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('PUT', '/organizations/' + organizationId + '/collections/' + id + '/users', request, true, false);
        });
    }
    deleteCollection(organizationId, id) {
        return this.send('DELETE', '/organizations/' + organizationId + '/collections/' + id, null, true, false);
    }
    deleteCollectionUser(organizationId, id, organizationUserId) {
        return this.send('DELETE', '/organizations/' + organizationId + '/collections/' + id + '/user/' + organizationUserId, null, true, false);
    }
    // Groups APIs
    getGroupDetails(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/organizations/' + organizationId + '/groups/' + id + '/details', null, true, true);
            return new groupResponse_1.GroupDetailsResponse(r);
        });
    }
    getGroups(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/organizations/' + organizationId + '/groups', null, true, true);
            return new listResponse_1.ListResponse(r, groupResponse_1.GroupResponse);
        });
    }
    getGroupUsers(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/organizations/' + organizationId + '/groups/' + id + '/users', null, true, true);
            return r;
        });
    }
    postGroup(organizationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/organizations/' + organizationId + '/groups', request, true, true);
            return new groupResponse_1.GroupResponse(r);
        });
    }
    putGroup(organizationId, id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/organizations/' + organizationId + '/groups/' + id, request, true, true);
            return new groupResponse_1.GroupResponse(r);
        });
    }
    putGroupUsers(organizationId, id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('PUT', '/organizations/' + organizationId + '/groups/' + id + '/users', request, true, false);
        });
    }
    deleteGroup(organizationId, id) {
        return this.send('DELETE', '/organizations/' + organizationId + '/groups/' + id, null, true, false);
    }
    deleteGroupUser(organizationId, id, organizationUserId) {
        return this.send('DELETE', '/organizations/' + organizationId + '/groups/' + id + '/user/' + organizationUserId, null, true, false);
    }
    // Organization User APIs
    getOrganizationUser(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/organizations/' + organizationId + '/users/' + id, null, true, true);
            return new organizationUserResponse_1.OrganizationUserDetailsResponse(r);
        });
    }
    getOrganizationUserGroups(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/organizations/' + organizationId + '/users/' + id + '/groups', null, true, true);
            return r;
        });
    }
    getOrganizationUsers(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/organizations/' + organizationId + '/users', null, true, true);
            return new listResponse_1.ListResponse(r, organizationUserResponse_1.OrganizationUserUserDetailsResponse);
        });
    }
    postOrganizationUserInvite(organizationId, request) {
        return this.send('POST', '/organizations/' + organizationId + '/users/invite', request, true, false);
    }
    postOrganizationUserReinvite(organizationId, id) {
        return this.send('POST', '/organizations/' + organizationId + '/users/' + id + '/reinvite', null, true, false);
    }
    postOrganizationUserAccept(organizationId, id, request) {
        return this.send('POST', '/organizations/' + organizationId + '/users/' + id + '/accept', request, true, false);
    }
    postOrganizationUserConfirm(organizationId, id, request) {
        return this.send('POST', '/organizations/' + organizationId + '/users/' + id + '/confirm', request, true, false);
    }
    putOrganizationUser(organizationId, id, request) {
        return this.send('PUT', '/organizations/' + organizationId + '/users/' + id, request, true, false);
    }
    putOrganizationUserGroups(organizationId, id, request) {
        return this.send('PUT', '/organizations/' + organizationId + '/users/' + id + '/groups', request, true, false);
    }
    deleteOrganizationUser(organizationId, id) {
        return this.send('DELETE', '/organizations/' + organizationId + '/users/' + id, null, true, false);
    }
    // Sync APIs
    getSync() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.isDesktopClient || this.isWebClient ? '/sync?excludeDomains=true' : '/sync';
            const r = yield this.send('GET', path, null, true, true);
            return new syncResponse_1.SyncResponse(r);
        });
    }
    postImportDirectory(organizationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send('POST', '/organizations/' + organizationId + '/import', request, true, false);
        });
    }
    // Settings APIs
    getSettingsDomains() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/settings/domains', null, true, true);
            return new domainsResponse_1.DomainsResponse(r);
        });
    }
    putSettingsDomains(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/settings/domains', request, true, true);
            return new domainsResponse_1.DomainsResponse(r);
        });
    }
    // Two-factor APIs
    getTwoFactorProviders() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/two-factor', null, true, true);
            return new listResponse_1.ListResponse(r, twoFactorProviderResponse_1.TwoFactorProviderResponse);
        });
    }
    getTwoFactorOrganizationProviders(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/organizations/' + organizationId + '/two-factor', null, true, true);
            return new listResponse_1.ListResponse(r, twoFactorProviderResponse_1.TwoFactorProviderResponse);
        });
    }
    getTwoFactorAuthenticator(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/two-factor/get-authenticator', request, true, true);
            return new twoFactorAuthenticatorResponse_1.TwoFactorAuthenticatorResponse(r);
        });
    }
    getTwoFactorEmail(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/two-factor/get-email', request, true, true);
            return new twoFactorEmailResponse_1.TwoFactorEmailResponse(r);
        });
    }
    getTwoFactorDuo(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/two-factor/get-duo', request, true, true);
            return new twoFactorDuoResponse_1.TwoFactorDuoResponse(r);
        });
    }
    getTwoFactorOrganizationDuo(organizationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/organizations/' + organizationId + '/two-factor/get-duo', request, true, true);
            return new twoFactorDuoResponse_1.TwoFactorDuoResponse(r);
        });
    }
    getTwoFactorYubiKey(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/two-factor/get-yubikey', request, true, true);
            return new twoFactorYubiKeyResponse_1.TwoFactorYubiKeyResponse(r);
        });
    }
    getTwoFactorU2f(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/two-factor/get-u2f', request, true, true);
            return new twoFactorU2fResponse_1.TwoFactorU2fResponse(r);
        });
    }
    getTwoFactorU2fChallenge(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/two-factor/get-u2f-challenge', request, true, true);
            return new twoFactorU2fResponse_1.ChallengeResponse(r);
        });
    }
    getTwoFactorRecover(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/two-factor/get-recover', request, true, true);
            return new twoFactorRescoverResponse_1.TwoFactorRecoverResponse(r);
        });
    }
    putTwoFactorAuthenticator(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/two-factor/authenticator', request, true, true);
            return new twoFactorAuthenticatorResponse_1.TwoFactorAuthenticatorResponse(r);
        });
    }
    putTwoFactorEmail(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/two-factor/email', request, true, true);
            return new twoFactorEmailResponse_1.TwoFactorEmailResponse(r);
        });
    }
    putTwoFactorDuo(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/two-factor/duo', request, true, true);
            return new twoFactorDuoResponse_1.TwoFactorDuoResponse(r);
        });
    }
    putTwoFactorOrganizationDuo(organizationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/organizations/' + organizationId + '/two-factor/duo', request, true, true);
            return new twoFactorDuoResponse_1.TwoFactorDuoResponse(r);
        });
    }
    putTwoFactorYubiKey(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/two-factor/yubikey', request, true, true);
            return new twoFactorYubiKeyResponse_1.TwoFactorYubiKeyResponse(r);
        });
    }
    putTwoFactorU2f(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/two-factor/u2f', request, true, true);
            return new twoFactorU2fResponse_1.TwoFactorU2fResponse(r);
        });
    }
    deleteTwoFactorU2f(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('DELETE', '/two-factor/u2f', request, true, true);
            return new twoFactorU2fResponse_1.TwoFactorU2fResponse(r);
        });
    }
    putTwoFactorDisable(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/two-factor/disable', request, true, true);
            return new twoFactorProviderResponse_1.TwoFactorProviderResponse(r);
        });
    }
    putTwoFactorOrganizationDisable(organizationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/organizations/' + organizationId + '/two-factor/disable', request, true, true);
            return new twoFactorProviderResponse_1.TwoFactorProviderResponse(r);
        });
    }
    postTwoFactorRecover(request) {
        return this.send('POST', '/two-factor/recover', request, false, false);
    }
    postTwoFactorEmailSetup(request) {
        return this.send('POST', '/two-factor/send-email', request, true, false);
    }
    postTwoFactorEmail(request) {
        return this.send('POST', '/two-factor/send-email-login', request, false, false);
    }
    // Organization APIs
    getOrganization(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/organizations/' + id, null, true, true);
            return new organizationResponse_1.OrganizationResponse(r);
        });
    }
    getOrganizationBilling(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/organizations/' + id + '/billing', null, true, true);
            return new billingResponse_1.BillingResponse(r);
        });
    }
    getOrganizationSubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/organizations/' + id + '/subscription', null, true, true);
            return new organizationSubscriptionResponse_1.OrganizationSubscriptionResponse(r);
        });
    }
    getOrganizationLicense(id, installationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send('GET', '/organizations/' + id + '/license?installationId=' + installationId, null, true, true);
        });
    }
    postOrganization(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/organizations', request, true, true);
            return new organizationResponse_1.OrganizationResponse(r);
        });
    }
    putOrganization(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('PUT', '/organizations/' + id, request, true, true);
            return new organizationResponse_1.OrganizationResponse(r);
        });
    }
    postLeaveOrganization(id) {
        return this.send('POST', '/organizations/' + id + '/leave', null, true, false);
    }
    postOrganizationLicense(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/organizations/license', data, true, true);
            return new organizationResponse_1.OrganizationResponse(r);
        });
    }
    postOrganizationLicenseUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send('POST', '/organizations/' + id + '/license', data, true, false);
        });
    }
    postOrganizationApiKey(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/organizations/' + id + '/api-key', request, true, true);
            return new apiKeyResponse_1.ApiKeyResponse(r);
        });
    }
    postOrganizationRotateApiKey(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/organizations/' + id + '/rotate-api-key', request, true, true);
            return new apiKeyResponse_1.ApiKeyResponse(r);
        });
    }
    postOrganizationUpgrade(id, request) {
        return this.send('POST', '/organizations/' + id + '/upgrade', request, true, false);
    }
    postOrganizationSeat(id, request) {
        return this.send('POST', '/organizations/' + id + '/seat', request, true, false);
    }
    postOrganizationStorage(id, request) {
        return this.send('POST', '/organizations/' + id + '/storage', request, true, false);
    }
    postOrganizationPayment(id, request) {
        return this.send('POST', '/organizations/' + id + '/payment', request, true, false);
    }
    postOrganizationVerifyBank(id, request) {
        return this.send('POST', '/organizations/' + id + '/verify-bank', request, true, false);
    }
    postOrganizationCancel(id) {
        return this.send('POST', '/organizations/' + id + '/cancel', null, true, false);
    }
    postOrganizationReinstate(id) {
        return this.send('POST', '/organizations/' + id + '/reinstate', null, true, false);
    }
    deleteOrganization(id, request) {
        return this.send('DELETE', '/organizations/' + id, request, true, false);
    }
    // Event APIs
    getEvents(start, end, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', this.addEventParameters('/events', start, end, token), null, true, true);
            return new listResponse_1.ListResponse(r, eventResponse_1.EventResponse);
        });
    }
    getEventsCipher(id, start, end, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', this.addEventParameters('/ciphers/' + id + '/events', start, end, token), null, true, true);
            return new listResponse_1.ListResponse(r, eventResponse_1.EventResponse);
        });
    }
    getEventsOrganization(id, start, end, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', this.addEventParameters('/organizations/' + id + '/events', start, end, token), null, true, true);
            return new listResponse_1.ListResponse(r, eventResponse_1.EventResponse);
        });
    }
    getEventsOrganizationUser(organizationId, id, start, end, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', this.addEventParameters('/organizations/' + organizationId + '/users/' + id + '/events', start, end, token), null, true, true);
            return new listResponse_1.ListResponse(r, eventResponse_1.EventResponse);
        });
    }
    // User APIs
    getUserPublicKey(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/users/' + id + '/public-key', null, true, true);
            return new userKeyResponse_1.UserKeyResponse(r);
        });
    }
    // HIBP APIs
    getHibpBreach(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('GET', '/hibp/breach?username=' + username, null, true, true);
            return r.map((a) => new breachAccountResponse_1.BreachAccountResponse(a));
        });
    }
    // Misc
    postBitPayInvoice(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send('POST', '/bitpay-invoice', request, true, true);
            return r;
        });
    }
    // Helpers
    getActiveBearerToken() {
        return __awaiter(this, void 0, void 0, function* () {
            let accessToken = yield this.tokenService.getToken();
            if (this.tokenService.tokenNeedsRefresh()) {
                const tokenResponse = yield this.doRefreshToken();
                accessToken = tokenResponse.accessToken;
            }
            return accessToken;
        });
    }
    fetch(request) {
        if (request.method === 'GET') {
            request.headers.set('Cache-Control', 'no-cache');
            request.headers.set('Pragma', 'no-cache');
        }
        return fetch(request);
    }
    send(method, path, body, authed, hasResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = new Headers({
                'Device-Type': this.deviceType,
            });
            const requestInit = {
                cache: 'no-cache',
                credentials: this.getCredentials(),
                method: method,
            };
            if (authed) {
                const authHeader = yield this.getActiveBearerToken();
                headers.set('Authorization', 'Bearer ' + authHeader);
            }
            if (body != null) {
                if (typeof body === 'string') {
                    requestInit.body = body;
                    headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
                }
                else if (typeof body === 'object') {
                    if (body instanceof FormData) {
                        requestInit.body = body;
                    }
                    else {
                        headers.set('Content-Type', 'application/json; charset=utf-8');
                        requestInit.body = JSON.stringify(body);
                    }
                }
            }
            if (hasResponse) {
                headers.set('Accept', 'application/json');
            }
            requestInit.headers = headers;
            const response = yield this.fetch(new Request(this.apiBaseUrl + path, requestInit));
            if (hasResponse && response.status === 200) {
                const responseJson = yield response.json();
                return responseJson;
            }
            else if (response.status !== 200) {
                const error = yield this.handleError(response, false);
                return Promise.reject(error);
            }
        });
    }
    handleError(response, tokenError) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((tokenError && response.status === 400) || response.status === 401 || response.status === 403) {
                yield this.logoutCallback(true);
                return null;
            }
            let responseJson = null;
            if (this.isJsonResponse(response)) {
                responseJson = yield response.json();
            }
            return new errorResponse_1.ErrorResponse(responseJson, response.status, tokenError);
        });
    }
    doRefreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = yield this.tokenService.getRefreshToken();
            if (refreshToken == null || refreshToken === '') {
                throw new Error();
            }
            const decodedToken = this.tokenService.decodeToken();
            const response = yield this.fetch(new Request(this.identityBaseUrl + '/connect/token', {
                body: this.qsStringify({
                    grant_type: 'refresh_token',
                    client_id: decodedToken.client_id,
                    refresh_token: refreshToken,
                }),
                cache: 'no-cache',
                credentials: this.getCredentials(),
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Accept': 'application/json',
                    'Device-Type': this.deviceType,
                }),
                method: 'POST',
            }));
            if (response.status === 200) {
                const responseJson = yield response.json();
                const tokenResponse = new identityTokenResponse_1.IdentityTokenResponse(responseJson);
                yield this.tokenService.setTokens(tokenResponse.accessToken, tokenResponse.refreshToken);
                return tokenResponse;
            }
            else {
                const error = yield this.handleError(response, true);
                return Promise.reject(error);
            }
        });
    }
    qsStringify(params) {
        return Object.keys(params).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
    }
    getCredentials() {
        if (!this.isWebClient || this.usingBaseUrl) {
            return 'include';
        }
        return undefined;
    }
    addEventParameters(base, start, end, token) {
        if (start != null) {
            base += ('?start=' + start);
        }
        if (end != null) {
            base += (base.indexOf('?') > -1 ? '&' : '?');
            base += ('end=' + end);
        }
        if (token != null) {
            base += (base.indexOf('?') > -1 ? '&' : '?');
            base += ('continuationToken=' + token);
        }
        return base;
    }
    isJsonResponse(response) {
        const typeHeader = response.headers.get('content-type');
        return typeHeader != null && typeHeader.indexOf('application/json') > -1;
    }
}
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map