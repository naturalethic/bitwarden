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
class ElectronRendererSecureStorageService {
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const val = electron_1.ipcRenderer.sendSync('keytar', {
                action: 'getPassword',
                key: key,
            });
            return Promise.resolve(val != null ? JSON.parse(val) : null);
        });
    }
    save(key, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            electron_1.ipcRenderer.sendSync('keytar', {
                action: 'setPassword',
                key: key,
                value: JSON.stringify(obj),
            });
            return Promise.resolve();
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            electron_1.ipcRenderer.sendSync('keytar', {
                action: 'deletePassword',
                key: key,
            });
            return Promise.resolve();
        });
    }
}
exports.ElectronRendererSecureStorageService = ElectronRendererSecureStorageService;
//# sourceMappingURL=electronRendererSecureStorage.service.js.map