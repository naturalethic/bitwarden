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
const electron_1 = require("electron");
const keytar_1 = require("keytar");
class KeytarStorageListener {
    constructor(serviceName) {
        this.serviceName = serviceName;
    }
    init() {
        electron_1.ipcMain.on('keytar', (event, message) => __awaiter(this, void 0, void 0, function* () {
            try {
                let val = null;
                if (message.action && message.key) {
                    if (message.action === 'getPassword') {
                        val = yield keytar_1.getPassword(this.serviceName, message.key);
                    }
                    else if (message.action === 'setPassword' && message.value) {
                        yield keytar_1.setPassword(this.serviceName, message.key, message.value);
                    }
                    else if (message.action === 'deletePassword') {
                        yield keytar_1.deletePassword(this.serviceName, message.key);
                    }
                }
                event.returnValue = val;
            }
            catch (_a) {
                event.returnValue = null;
            }
        }));
    }
}
exports.KeytarStorageListener = KeytarStorageListener;
//# sourceMappingURL=keytarStorageListener.js.map