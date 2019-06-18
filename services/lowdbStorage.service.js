"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");
const nodeUtils_1 = require("../misc/nodeUtils");
const utils_1 = require("../misc/utils");
class LowdbStorageService {
    constructor(defaults, dir, allowCache = false) {
        this.allowCache = allowCache;
        this.defaults = defaults;
        let adapter;
        if (utils_1.Utils.isNode && dir != null) {
            if (!fs.existsSync(dir)) {
                nodeUtils_1.NodeUtils.mkdirpSync(dir, '700');
            }
            this.dataFilePath = path.join(dir, 'data.json');
            adapter = new FileSync(this.dataFilePath);
        }
        try {
            this.db = lowdb(adapter);
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                adapter.write({});
                this.db = lowdb(adapter);
            }
            else {
                throw e;
            }
        }
    }
    init() {
        if (this.defaults != null) {
            this.readForNoCache();
            this.db.defaults(this.defaults).write();
        }
    }
    get(key) {
        this.readForNoCache();
        const val = this.db.get(key).value();
        if (val == null) {
            return Promise.resolve(null);
        }
        return Promise.resolve(val);
    }
    save(key, obj) {
        this.readForNoCache();
        this.db.set(key, obj).write();
        return Promise.resolve();
    }
    remove(key) {
        this.readForNoCache();
        this.db.unset(key).write();
        return Promise.resolve();
    }
    readForNoCache() {
        if (!this.allowCache) {
            this.db.read();
        }
    }
}
exports.LowdbStorageService = LowdbStorageService;
//# sourceMappingURL=lowdbStorage.service.js.map