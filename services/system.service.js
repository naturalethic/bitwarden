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
const utils_1 = require("../misc/utils");
class SystemService {
    constructor(storageService, lockService, messagingService, platformUtilsService, reloadCallback = null) {
        this.storageService = storageService;
        this.lockService = lockService;
        this.messagingService = messagingService;
        this.platformUtilsService = platformUtilsService;
        this.reloadCallback = reloadCallback;
        this.reloadInterval = null;
        this.clearClipboardTimeout = null;
        this.clearClipboardTimeoutFunction = null;
    }
    startProcessReload() {
        if (this.lockService.pinLocked || this.reloadInterval != null) {
            return;
        }
        this.cancelProcessReload();
        this.reloadInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            let doRefresh = false;
            const lastActive = yield this.storageService.get(constants_service_1.ConstantsService.lastActiveKey);
            if (lastActive != null) {
                const diffSeconds = (new Date()).getTime() - lastActive;
                // Don't refresh if they are still active in the window
                doRefresh = diffSeconds >= 5000;
            }
            if (doRefresh) {
                clearInterval(this.reloadInterval);
                this.reloadInterval = null;
                this.messagingService.send('reloadProcess');
                if (this.reloadCallback != null) {
                    yield this.reloadCallback();
                }
            }
        }), 10000);
    }
    cancelProcessReload() {
        if (this.reloadInterval != null) {
            clearInterval(this.reloadInterval);
            this.reloadInterval = null;
        }
    }
    clearClipboard(clipboardValue, timeoutMs = null) {
        if (this.clearClipboardTimeout != null) {
            clearTimeout(this.clearClipboardTimeout);
            this.clearClipboardTimeout = null;
        }
        if (utils_1.Utils.isNullOrWhitespace(clipboardValue)) {
            return;
        }
        this.storageService.get(constants_service_1.ConstantsService.clearClipboardKey).then((clearSeconds) => {
            if (clearSeconds == null) {
                return;
            }
            if (timeoutMs == null) {
                timeoutMs = clearSeconds * 1000;
            }
            this.clearClipboardTimeoutFunction = () => __awaiter(this, void 0, void 0, function* () {
                const clipboardValueNow = yield this.platformUtilsService.readFromClipboard();
                if (clipboardValue === clipboardValueNow) {
                    this.platformUtilsService.copyToClipboard('', { clearing: true });
                }
            });
            this.clearClipboardTimeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield this.clearPendingClipboard();
            }), timeoutMs);
        });
    }
    clearPendingClipboard() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.clearClipboardTimeoutFunction != null) {
                yield this.clearClipboardTimeoutFunction();
                this.clearClipboardTimeoutFunction = null;
            }
        });
    }
}
exports.SystemService = SystemService;
//# sourceMappingURL=system.service.js.map