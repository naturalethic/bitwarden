"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passwordHistoryData_1 = require("../data/passwordHistoryData");
const domainBase_1 = require("./domainBase");
const passwordHistoryView_1 = require("../view/passwordHistoryView");
class Password extends domainBase_1.default {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            password: null,
        }, alreadyEncrypted);
        this.lastUsedDate = new Date(obj.lastUsedDate);
    }
    decrypt(orgId) {
        return this.decryptObj(new passwordHistoryView_1.PasswordHistoryView(this), {
            password: null,
        }, orgId);
    }
    toPasswordHistoryData() {
        const ph = new passwordHistoryData_1.PasswordHistoryData();
        ph.lastUsedDate = this.lastUsedDate.toISOString();
        this.buildDataModel(this, ph, {
            password: null,
        });
        return ph;
    }
}
exports.Password = Password;
//# sourceMappingURL=password.js.map