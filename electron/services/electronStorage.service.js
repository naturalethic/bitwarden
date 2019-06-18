"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const nodeUtils_1 = require("../../misc/nodeUtils");
// tslint:disable-next-line
const Store = require('electron-store');
class ElectronStorageService {
    constructor(dir, defaults = {}) {
        if (!fs.existsSync(dir)) {
            nodeUtils_1.NodeUtils.mkdirpSync(dir, '700');
        }
        const storeConfig = {
            defaults: defaults,
            name: 'data',
        };
        this.store = new Store(storeConfig);
    }
    get(key) {
        const val = this.store.get(key);
        return Promise.resolve(val != null ? val : null);
    }
    save(key, obj) {
        this.store.set(key, obj);
        return Promise.resolve();
    }
    remove(key) {
        this.store.delete(key);
        return Promise.resolve();
    }
}
exports.ElectronStorageService = ElectronStorageService;
//# sourceMappingURL=electronStorage.service.js.map