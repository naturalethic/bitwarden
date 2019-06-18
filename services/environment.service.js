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
const environmentUrls_1 = require("../models/domain/environmentUrls");
const constants_service_1 = require("./constants.service");
class EnvironmentService {
    constructor(apiService, storageService, notificationsService) {
        this.apiService = apiService;
        this.storageService = storageService;
        this.notificationsService = notificationsService;
    }
    getWebVaultUrl() {
        if (this.webVaultUrl != null) {
            return this.webVaultUrl;
        }
        else if (this.baseUrl) {
            return this.baseUrl;
        }
        return null;
    }
    setUrlsFromStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const urlsObj = yield this.storageService.get(constants_service_1.ConstantsService.environmentUrlsKey);
            const urls = urlsObj || {
                base: null,
                api: null,
                identity: null,
                icons: null,
                notifications: null,
                webVault: null,
            };
            const envUrls = new environmentUrls_1.EnvironmentUrls();
            if (urls.base) {
                this.baseUrl = envUrls.base = urls.base;
                this.apiService.setUrls(envUrls);
                return;
            }
            this.webVaultUrl = urls.webVault;
            this.apiUrl = envUrls.api = urls.api;
            this.identityUrl = envUrls.identity = urls.identity;
            this.iconsUrl = urls.icons;
            this.notificationsUrl = urls.notifications;
            this.apiService.setUrls(envUrls);
        });
    }
    setUrls(urls) {
        return __awaiter(this, void 0, void 0, function* () {
            urls.base = this.formatUrl(urls.base);
            urls.webVault = this.formatUrl(urls.webVault);
            urls.api = this.formatUrl(urls.api);
            urls.identity = this.formatUrl(urls.identity);
            urls.icons = this.formatUrl(urls.icons);
            urls.notifications = this.formatUrl(urls.notifications);
            yield this.storageService.save(constants_service_1.ConstantsService.environmentUrlsKey, {
                base: urls.base,
                api: urls.api,
                identity: urls.identity,
                webVault: urls.webVault,
                icons: urls.icons,
                notifications: urls.notifications,
            });
            this.baseUrl = urls.base;
            this.webVaultUrl = urls.webVault;
            this.apiUrl = urls.api;
            this.identityUrl = urls.identity;
            this.iconsUrl = urls.icons;
            this.notificationsUrl = urls.notifications;
            const envUrls = new environmentUrls_1.EnvironmentUrls();
            if (this.baseUrl) {
                envUrls.base = this.baseUrl;
            }
            else {
                envUrls.api = this.apiUrl;
                envUrls.identity = this.identityUrl;
            }
            this.apiService.setUrls(envUrls);
            if (this.notificationsService != null) {
                this.notificationsService.init(this);
            }
            return urls;
        });
    }
    formatUrl(url) {
        if (url == null || url === '') {
            return null;
        }
        url = url.replace(/\/+$/g, '');
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        return url.trim();
    }
}
exports.EnvironmentService = EnvironmentService;
//# sourceMappingURL=environment.service.js.map