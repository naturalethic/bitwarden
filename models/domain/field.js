"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fieldData_1 = require("../data/fieldData");
const domainBase_1 = require("./domainBase");
const fieldView_1 = require("../view/fieldView");
class Field extends domainBase_1.default {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.type = obj.type;
        this.buildDomainModel(this, obj, {
            name: null,
            value: null,
        }, alreadyEncrypted, []);
    }
    decrypt(orgId) {
        return this.decryptObj(new fieldView_1.FieldView(this), {
            name: null,
            value: null,
        }, orgId);
    }
    toFieldData() {
        const f = new fieldData_1.FieldData();
        this.buildDataModel(this, f, {
            name: null,
            value: null,
            type: null,
        }, ['type']);
        return f;
    }
}
exports.Field = Field;
//# sourceMappingURL=field.js.map