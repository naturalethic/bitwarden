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
const signalR = require("@aspnet/signalr");
const signalRMsgPack = require("@aspnet/signalr-protocol-msgpack");
const notificationType_1 = require("../enums/notificationType");
const notificationResponse_1 = require("../models/response/notificationResponse");
class NotificationsService {
    constructor(userService, syncService, appIdService, apiService, lockService, logoutCallback) {
        this.userService = userService;
        this.syncService = syncService;
        this.appIdService = appIdService;
        this.apiService = apiService;
        this.lockService = lockService;
        this.logoutCallback = logoutCallback;
        this.connected = false;
        this.inited = false;
        this.inactive = false;
        this.reconnectTimer = null;
    }
    init(environmentService) {
        return __awaiter(this, void 0, void 0, function* () {
            this.inited = false;
            this.url = 'https://notifications.bitwarden.com';
            if (environmentService.notificationsUrl != null) {
                this.url = environmentService.notificationsUrl;
            }
            else if (environmentService.baseUrl != null) {
                this.url = environmentService.baseUrl + '/notifications';
            }
            // Set notifications server URL to `https://-` to effectively disable communication
            // with the notifications server from the client app
            if (this.url === 'https://-') {
                return;
            }
            if (this.signalrConnection != null) {
                this.signalrConnection.off('ReceiveMessage');
                yield this.signalrConnection.stop();
                this.connected = false;
                this.signalrConnection = null;
            }
            this.signalrConnection = new signalR.HubConnectionBuilder()
                .withUrl(this.url + '/hub', {
                accessTokenFactory: () => this.apiService.getActiveBearerToken(),
            })
                .withHubProtocol(new signalRMsgPack.MessagePackHubProtocol())
                // .configureLogging(signalR.LogLevel.Trace)
                .build();
            this.signalrConnection.on('ReceiveMessage', (data) => this.processNotification(new notificationResponse_1.NotificationResponse(data)));
            this.signalrConnection.onclose(() => {
                this.connected = false;
                this.reconnect(true);
            });
            this.inited = true;
            if (yield this.isAuthedAndUnlocked()) {
                yield this.reconnect(false);
            }
        });
    }
    updateConnection(sync = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.inited) {
                return;
            }
            try {
                if (yield this.isAuthedAndUnlocked()) {
                    yield this.reconnect(sync);
                }
                else {
                    yield this.signalrConnection.stop();
                }
            }
            catch (e) {
                // tslint:disable-next-line
                console.error(e.toString());
            }
        });
    }
    reconnectFromActivity() {
        return __awaiter(this, void 0, void 0, function* () {
            this.inactive = false;
            if (this.inited && !this.connected) {
                yield this.reconnect(true);
            }
        });
    }
    disconnectFromInactivity() {
        return __awaiter(this, void 0, void 0, function* () {
            this.inactive = true;
            if (this.inited && this.connected) {
                yield this.signalrConnection.stop();
            }
        });
    }
    processNotification(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            const appId = yield this.appIdService.getAppId();
            if (notification == null || notification.contextId === appId) {
                return;
            }
            const isAuthenticated = yield this.userService.isAuthenticated();
            const payloadUserId = notification.payload.userId || notification.payload.UserId;
            const myUserId = yield this.userService.getUserId();
            if (isAuthenticated && payloadUserId != null && payloadUserId !== myUserId) {
                return;
            }
            switch (notification.type) {
                case notificationType_1.NotificationType.SyncCipherCreate:
                case notificationType_1.NotificationType.SyncCipherUpdate:
                    yield this.syncService.syncUpsertCipher(notification.payload, notification.type === notificationType_1.NotificationType.SyncCipherUpdate);
                    break;
                case notificationType_1.NotificationType.SyncCipherDelete:
                case notificationType_1.NotificationType.SyncLoginDelete:
                    yield this.syncService.syncDeleteCipher(notification.payload);
                    break;
                case notificationType_1.NotificationType.SyncFolderCreate:
                case notificationType_1.NotificationType.SyncFolderUpdate:
                    yield this.syncService.syncUpsertFolder(notification.payload, notification.type === notificationType_1.NotificationType.SyncFolderUpdate);
                    break;
                case notificationType_1.NotificationType.SyncFolderDelete:
                    yield this.syncService.syncDeleteFolder(notification.payload);
                    break;
                case notificationType_1.NotificationType.SyncVault:
                case notificationType_1.NotificationType.SyncCiphers:
                case notificationType_1.NotificationType.SyncSettings:
                    if (isAuthenticated) {
                        yield this.syncService.fullSync(false);
                    }
                    break;
                case notificationType_1.NotificationType.SyncOrgKeys:
                    if (isAuthenticated) {
                        yield this.apiService.refreshIdentityToken();
                        yield this.syncService.fullSync(true);
                        // Stop so a reconnect can be made
                        yield this.signalrConnection.stop();
                    }
                    break;
                case notificationType_1.NotificationType.LogOut:
                    if (isAuthenticated) {
                        this.logoutCallback();
                    }
                    break;
                default:
                    break;
            }
        });
    }
    reconnect(sync) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.reconnectTimer != null) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }
            if (this.connected || !this.inited || this.inactive) {
                return;
            }
            const authedAndUnlocked = yield this.isAuthedAndUnlocked();
            if (!authedAndUnlocked) {
                return;
            }
            try {
                yield this.signalrConnection.start();
                this.connected = true;
                if (sync) {
                    yield this.syncService.fullSync(false);
                }
            }
            catch (_a) { }
            if (!this.connected) {
                this.reconnectTimer = setTimeout(() => this.reconnect(sync), this.random(120000, 300000));
            }
        });
    }
    isAuthedAndUnlocked() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.userService.isAuthenticated()) {
                const locked = yield this.lockService.isLocked();
                return !locked;
            }
            return false;
        });
    }
    random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
exports.NotificationsService = NotificationsService;
//# sourceMappingURL=notifications.service.js.map