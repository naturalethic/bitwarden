"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CardView {
    // tslint:enable
    constructor(c) {
        this.cardholderName = null;
        this.expMonth = null;
        this.expYear = null;
        this.code = null;
        // tslint:disable
        this._brand = null;
        this._number = null;
        this._subTitle = null;
        // ctor
    }
    get maskedCode() {
        return this.code != null ? '•'.repeat(this.code.length) : null;
    }
    get brand() {
        return this._brand;
    }
    set brand(value) {
        this._brand = value;
        this._subTitle = null;
    }
    get number() {
        return this._number;
    }
    set number(value) {
        this._number = value;
        this._subTitle = null;
    }
    get subTitle() {
        if (this._subTitle == null) {
            this._subTitle = this.brand;
            if (this.number != null && this.number.length >= 4) {
                if (this._subTitle != null && this._subTitle !== '') {
                    this._subTitle += ', ';
                }
                else {
                    this._subTitle = '';
                }
                // Show last 5 on amex, last 4 for all others
                const count = this.number.length >= 5 && this.number.match(new RegExp('^3[47]')) != null ? 5 : 4;
                this._subTitle += ('*' + this.number.substr(this.number.length - count));
            }
        }
        return this._subTitle;
    }
    get expiration() {
        if (!this.expMonth && !this.expYear) {
            return null;
        }
        let exp = this.expMonth != null ? ('0' + this.expMonth).slice(-2) : '__';
        exp += (' / ' + (this.expYear != null ? this.formatYear(this.expYear) : '____'));
        return exp;
    }
    formatYear(year) {
        return year.length === 2 ? '20' + year : year;
    }
}
exports.CardView = CardView;
//# sourceMappingURL=cardView.js.map