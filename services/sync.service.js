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
const cipherData_1 = require("../models/data/cipherData");
const collectionData_1 = require("../models/data/collectionData");
const folderData_1 = require("../models/data/folderData");
const organizationData_1 = require("../models/data/organizationData");
const Keys = {
    lastSyncPrefix: 'lastSync_',
};
class SyncService {
    constructor(userService, apiService, settingsService, folderService, cipherService, cryptoService, collectionService, storageService, messagingService, logoutCallback) {
        this.userService = userService;
        this.apiService = apiService;
        this.settingsService = settingsService;
        this.folderService = folderService;
        this.cipherService = cipherService;
        this.cryptoService = cryptoService;
        this.collectionService = collectionService;
        this.storageService = storageService;
        this.messagingService = messagingService;
        this.logoutCallback = logoutCallback;
        this.syncInProgress = false;
    }
    getLastSync() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            if (userId == null) {
                return null;
            }
            const lastSync = yield this.storageService.get(Keys.lastSyncPrefix + userId);
            if (lastSync) {
                return new Date(lastSync);
            }
            return null;
        });
    }
    setLastSync(date) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            if (userId == null) {
                return;
            }
            yield this.storageService.save(Keys.lastSyncPrefix + userId, date.toJSON());
        });
    }
    fullSync(forceSync) {
        return __awaiter(this, void 0, void 0, function* () {
            this.syncStarted();
            const isAuthenticated = yield this.userService.isAuthenticated();
            if (!isAuthenticated) {
                return this.syncCompleted(false);
            }
            const now = new Date();
            const needsSyncResult = yield this.needsSyncing(forceSync);
            const needsSync = needsSyncResult[0];
            const skipped = needsSyncResult[1];
            if (skipped) {
                return this.syncCompleted(false);
            }
            if (!needsSync) {
                yield this.setLastSync(now);
                return this.syncCompleted(false);
            }
            const userId = yield this.userService.getUserId();
            try {
                const response = yield this.apiService.getSync();
                yield this.syncProfile(response.profile);
                yield this.syncFolders(userId, response.folders);
                yield this.syncCollections(response.collections);
                yield this.syncCiphers(userId, response.ciphers);
                yield this.syncSettings(userId, response.domains);
                yield this.setLastSync(now);
                return this.syncCompleted(true);
            }
            catch (e) {
                return this.syncCompleted(false);
            }
        });
    }
    syncUpsertFolder(notification, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            this.syncStarted();
            if (yield this.userService.isAuthenticated()) {
                try {
                    const localFolder = yield this.folderService.get(notification.id);
                    if ((!isEdit && localFolder == null) ||
                        (isEdit && localFolder != null && localFolder.revisionDate < notification.revisionDate)) {
                        const remoteFolder = yield this.apiService.getFolder(notification.id);
                        if (remoteFolder != null) {
                            const userId = yield this.userService.getUserId();
                            yield this.folderService.upsert(new folderData_1.FolderData(remoteFolder, userId));
                            this.messagingService.send('syncedUpsertedFolder', { folderId: notification.id });
                            return this.syncCompleted(true);
                        }
                    }
                }
                catch (_a) { }
            }
            return this.syncCompleted(false);
        });
    }
    syncDeleteFolder(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            this.syncStarted();
            if (yield this.userService.isAuthenticated()) {
                yield this.folderService.delete(notification.id);
                this.messagingService.send('syncedDeletedFolder', { folderId: notification.id });
                this.syncCompleted(true);
                return true;
            }
            return this.syncCompleted(false);
        });
    }
    syncUpsertCipher(notification, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            this.syncStarted();
            if (yield this.userService.isAuthenticated()) {
                try {
                    let shouldUpdate = true;
                    const localCipher = yield this.cipherService.get(notification.id);
                    if (localCipher != null && localCipher.revisionDate >= notification.revisionDate) {
                        shouldUpdate = false;
                    }
                    let checkCollections = false;
                    if (shouldUpdate) {
                        if (isEdit) {
                            shouldUpdate = localCipher != null;
                            checkCollections = true;
                        }
                        else {
                            if (notification.collectionIds == null || notification.organizationId == null) {
                                shouldUpdate = localCipher == null;
                            }
                            else {
                                shouldUpdate = false;
                                checkCollections = true;
                            }
                        }
                    }
                    if (!shouldUpdate && checkCollections && notification.organizationId != null &&
                        notification.collectionIds != null && notification.collectionIds.length > 0) {
                        const collections = yield this.collectionService.getAll();
                        if (collections != null) {
                            for (let i = 0; i < collections.length; i++) {
                                if (notification.collectionIds.indexOf(collections[i].id) > -1) {
                                    shouldUpdate = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (shouldUpdate) {
                        const remoteCipher = yield this.apiService.getCipher(notification.id);
                        if (remoteCipher != null) {
                            const userId = yield this.userService.getUserId();
                            yield this.cipherService.upsert(new cipherData_1.CipherData(remoteCipher, userId));
                            this.messagingService.send('syncedUpsertedCipher', { cipherId: notification.id });
                            return this.syncCompleted(true);
                        }
                    }
                }
                catch (e) {
                    if (e != null && e.statusCode === 404 && isEdit) {
                        yield this.cipherService.delete(notification.id);
                        this.messagingService.send('syncedDeletedCipher', { cipherId: notification.id });
                        return this.syncCompleted(true);
                    }
                }
            }
            return this.syncCompleted(false);
        });
    }
    syncDeleteCipher(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            this.syncStarted();
            if (yield this.userService.isAuthenticated()) {
                yield this.cipherService.delete(notification.id);
                this.messagingService.send('syncedDeletedCipher', { cipherId: notification.id });
                return this.syncCompleted(true);
            }
            return this.syncCompleted(false);
        });
    }
    // Helpers
    syncStarted() {
        this.syncInProgress = true;
        this.messagingService.send('syncStarted');
    }
    syncCompleted(successfully) {
        this.syncInProgress = false;
        this.messagingService.send('syncCompleted', { successfully: successfully });
        return successfully;
    }
    needsSyncing(forceSync) {
        return __awaiter(this, void 0, void 0, function* () {
            if (forceSync) {
                return [true, false];
            }
            const lastSync = yield this.getLastSync();
            if (lastSync == null || lastSync.getTime() === 0) {
                return [true, false];
            }
            try {
                const response = yield this.apiService.getAccountRevisionDate();
                if (new Date(response) <= lastSync) {
                    return [false, false];
                }
                return [true, false];
            }
            catch (e) {
                return [false, true];
            }
        });
    }
    syncProfile(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const stamp = yield this.userService.getSecurityStamp();
            if (stamp != null && stamp !== response.securityStamp) {
                if (this.logoutCallback != null) {
                    yield this.logoutCallback(true);
                }
                throw new Error('Stamp has changed');
            }
            yield this.cryptoService.setEncKey(response.key);
            yield this.cryptoService.setEncPrivateKey(response.privateKey);
            yield this.cryptoService.setOrgKeys(response.organizations);
            yield this.userService.setSecurityStamp(response.securityStamp);
            const organizations = {};
            response.organizations.forEach((o) => {
                organizations[o.id] = new organizationData_1.OrganizationData(o);
            });
            return yield this.userService.replaceOrganizations(organizations);
        });
    }
    syncFolders(userId, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = {};
            response.forEach((f) => {
                folders[f.id] = new folderData_1.FolderData(f, userId);
            });
            return yield this.folderService.replace(folders);
        });
    }
    syncCollections(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const collections = {};
            response.forEach((c) => {
                collections[c.id] = new collectionData_1.CollectionData(c);
            });
            return yield this.collectionService.replace(collections);
        });
    }
    syncCiphers(userId, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const ciphers = {};
            response.forEach((c) => {
                ciphers[c.id] = new cipherData_1.CipherData(c, userId);
            });
            return yield this.cipherService.replace(ciphers);
        });
    }
    syncSettings(userId, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let eqDomains = [];
            if (response != null && response.equivalentDomains != null) {
                eqDomains = eqDomains.concat(response.equivalentDomains);
            }
            if (response != null && response.globalEquivalentDomains != null) {
                response.globalEquivalentDomains.forEach((global) => {
                    if (global.domains.length > 0) {
                        eqDomains.push(global.domains);
                    }
                });
            }
            return this.settingsService.setEquivalentDomains(eqDomains);
        });
    }
}
exports.SyncService = SyncService;
//# sourceMappingURL=sync.service.js.map