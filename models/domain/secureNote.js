"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secureNoteData_1 = require("../data/secureNoteData");
const domainBase_1 = require("./domainBase");
const secureNoteView_1 = require("../view/secureNoteView");
class SecureNote extends domainBase_1.default {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.type = obj.type;
    }
    decrypt(orgId) {
        return Promise.resolve(new secureNoteView_1.SecureNoteView(this));
    }
    toSecureNoteData() {
        const n = new secureNoteData_1.SecureNoteData();
        n.type = this.type;
        return n;
    }
}
exports.SecureNote = SecureNote;
//# sourceMappingURL=secureNote.js.map