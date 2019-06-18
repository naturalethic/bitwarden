"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../misc/utils");
class IdentityView {
    // tslint:enable
    constructor(i) {
        this.title = null;
        this.middleName = null;
        this.address1 = null;
        this.address2 = null;
        this.address3 = null;
        this.city = null;
        this.state = null;
        this.postalCode = null;
        this.country = null;
        this.company = null;
        this.email = null;
        this.phone = null;
        this.ssn = null;
        this.username = null;
        this.passportNumber = null;
        this.licenseNumber = null;
        // tslint:disable
        this._firstName = null;
        this._lastName = null;
        this._subTitle = null;
        // ctor
    }
    get firstName() {
        return this._firstName;
    }
    set firstName(value) {
        this._firstName = value;
        this._subTitle = null;
    }
    get lastName() {
        return this._lastName;
    }
    set lastName(value) {
        this._lastName = value;
        this._subTitle = null;
    }
    get subTitle() {
        if (this._subTitle == null && (this.firstName != null || this.lastName != null)) {
            this._subTitle = '';
            if (this.firstName != null) {
                this._subTitle = this.firstName;
            }
            if (this.lastName != null) {
                if (this._subTitle !== '') {
                    this._subTitle += ' ';
                }
                this._subTitle += this.lastName;
            }
        }
        return this._subTitle;
    }
    get fullName() {
        if (this.title != null || this.firstName != null || this.middleName != null || this.lastName != null) {
            let name = '';
            if (this.title != null) {
                name += (this.title + ' ');
            }
            if (this.firstName != null) {
                name += (this.firstName + ' ');
            }
            if (this.middleName != null) {
                name += (this.middleName + ' ');
            }
            if (this.lastName != null) {
                name += this.lastName;
            }
            return name.trim();
        }
        return null;
    }
    get fullAddress() {
        let address = this.address1;
        if (!utils_1.Utils.isNullOrWhitespace(this.address2)) {
            if (!utils_1.Utils.isNullOrWhitespace(address)) {
                address += ', ';
            }
            address += this.address2;
        }
        if (!utils_1.Utils.isNullOrWhitespace(this.address3)) {
            if (!utils_1.Utils.isNullOrWhitespace(address)) {
                address += ', ';
            }
            address += this.address3;
        }
        return address;
    }
    get fullAddressPart2() {
        if (this.city == null && this.state == null && this.postalCode == null) {
            return null;
        }
        const city = this.city || '-';
        const state = this.state || '-';
        const postalCode = this.postalCode || '-';
        return city + ', ' + state + ', ' + postalCode;
    }
}
exports.IdentityView = IdentityView;
//# sourceMappingURL=identityView.js.map