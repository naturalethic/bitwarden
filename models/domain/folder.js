"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const folderView_1 = require("../view/folderView");
const domainBase_1 = require("./domainBase");
class Folder extends domainBase_1.default {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            id: null,
            name: null,
        }, alreadyEncrypted, ['id']);
        this.revisionDate = obj.revisionDate != null ? new Date(obj.revisionDate) : null;
    }
    decrypt() {
        return this.decryptObj(new folderView_1.FolderView(this), {
            name: null,
        }, null);
    }
}
exports.Folder = Folder;
//# sourceMappingURL=folder.js.map