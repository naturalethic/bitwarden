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
const constants_service_1 = require("./constants.service");
class LockService {
    constructor(cipherService, folderService, collectionService, cryptoService, platformUtilsService, storageService, messagingService, searchService, userService, lockedCallback = null) {
        this.cipherService = cipherService;
        this.folderService = folderService;
        this.collectionService = collectionService;
        this.cryptoService = cryptoService;
        this.platformUtilsService = platformUtilsService;
        this.storageService = storageService;
        this.messagingService = messagingService;
        this.searchService = searchService;
        this.userService = userService;
        this.lockedCallback = lockedCallback;
        this.pinLocked = false;
        this.inited = false;
    }
    init(checkOnInterval) {
        if (this.inited) {
            return;
        }
        this.inited = true;
        if (checkOnInterval) {
            this.checkLock();
            setInterval(() => this.checkLock(), 10 * 1000); // check every 10 seconds
        }
    }
    isLocked() {
        return __awaiter(this, void 0, void 0, function* () {
            const hasKey = yield this.cryptoService.hasKey();
            if (hasKey && this.pinLocked) {
                return true;
            }
            return !hasKey;
        });
    }
    checkLock() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.platformUtilsService.isViewOpen()) {
                // Do not lock
                return;
            }
            const authed = yield this.userService.isAuthenticated();
            if (!authed) {
                return;
            }
            if (yield this.isLocked()) {
                return;
            }
            let lockOption = this.platformUtilsService.lockTimeout();
            if (lockOption == null) {
                lockOption = yield this.storageService.get(constants_service_1.ConstantsService.lockOptionKey);
            }
            if (lockOption == null || lockOption < 0) {
                return;
            }
            const lastActive = yield this.storageService.get(constants_service_1.ConstantsService.lastActiveKey);
            if (lastActive == null) {
                return;
            }
            const lockOptionSeconds = lockOption * 60;
            const diffSeconds = ((new Date()).getTime() - lastActive) / 1000;
            if (diffSeconds >= lockOptionSeconds) {
                // need to lock now
                yield this.lock(true);
            }
        });
    }
    lock(allowSoftLock = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const authed = yield this.userService.isAuthenticated();
            if (!authed) {
                return;
            }
            if (allowSoftLock) {
                const pinSet = yield this.isPinLockSet();
                if (pinSet[0]) {
                    this.pinLocked = true;
                    this.messagingService.send('locked');
                    if (this.lockedCallback != null) {
                        yield this.lockedCallback();
                    }
                    return;
                }
            }
            yield Promise.all([
                this.cryptoService.clearKey(),
                this.cryptoService.clearOrgKeys(true),
                this.cryptoService.clearKeyPair(true),
                this.cryptoService.clearEncKey(true),
            ]);
            this.folderService.clearCache();
            this.cipherService.clearCache();
            this.collectionService.clearCache();
            this.searchService.clearIndex();
            this.messagingService.send('locked');
            if (this.lockedCallback != null) {
                yield this.lockedCallback();
            }
        });
    }
    setLockOption(lockOption) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.save(constants_service_1.ConstantsService.lockOptionKey, lockOption);
            yield this.cryptoService.toggleKey();
        });
    }
    isPinLockSet() {
        return __awaiter(this, void 0, void 0, function* () {
            const protectedPin = yield this.storageService.get(constants_service_1.ConstantsService.protectedPin);
            const pinProtectedKey = yield this.storageService.get(constants_service_1.ConstantsService.pinProtectedKey);
            return [protectedPin != null, pinProtectedKey != null];
        });
    }
    clear() {
        return this.storageService.remove(constants_service_1.ConstantsService.protectedPin);
    }
}
exports.LockService = LockService;
//# sourceMappingURL=lock.service.js.map