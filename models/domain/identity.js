"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identityData_1 = require("../data/identityData");
const domainBase_1 = require("./domainBase");
const identityView_1 = require("../view/identityView");
class Identity extends domainBase_1.default {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            title: null,
            firstName: null,
            middleName: null,
            lastName: null,
            address1: null,
            address2: null,
            address3: null,
            city: null,
            state: null,
            postalCode: null,
            country: null,
            company: null,
            email: null,
            phone: null,
            ssn: null,
            username: null,
            passportNumber: null,
            licenseNumber: null,
        }, alreadyEncrypted, []);
    }
    decrypt(orgId) {
        return this.decryptObj(new identityView_1.IdentityView(this), {
            title: null,
            firstName: null,
            middleName: null,
            lastName: null,
            address1: null,
            address2: null,
            address3: null,
            city: null,
            state: null,
            postalCode: null,
            country: null,
            company: null,
            email: null,
            phone: null,
            ssn: null,
            username: null,
            passportNumber: null,
            licenseNumber: null,
        }, orgId);
    }
    toIdentityData() {
        const i = new identityData_1.IdentityData();
        this.buildDataModel(this, i, {
            title: null,
            firstName: null,
            middleName: null,
            lastName: null,
            address1: null,
            address2: null,
            address3: null,
            city: null,
            state: null,
            postalCode: null,
            country: null,
            company: null,
            email: null,
            phone: null,
            ssn: null,
            username: null,
            passportNumber: null,
            licenseNumber: null,
        });
        return i;
    }
}
exports.Identity = Identity;
//# sourceMappingURL=identity.js.map