"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const cardView_1 = require("../models/view/cardView");
const identityView_1 = require("../models/view/identityView");
const passwordHistoryView_1 = require("../models/view/passwordHistoryView");
const secureNoteView_1 = require("../models/view/secureNoteView");
const cipherType_1 = require("../enums/cipherType");
const fieldType_1 = require("../enums/fieldType");
const secureNoteType_1 = require("../enums/secureNoteType");
class OnePassword1PifImporter extends baseImporter_1.BaseImporter {
    constructor() {
        super(...arguments);
        this.result = new importResult_1.ImportResult();
    }
    parse(data) {
        data.split(this.newLineRegex).forEach((line) => {
            if (this.isNullOrWhitespace(line) || line[0] !== '{') {
                return;
            }
            const item = JSON.parse(line);
            const cipher = this.initLoginCipher();
            if (this.isNullOrWhitespace(item.hmac)) {
                this.processStandardItem(item, cipher);
            }
            else {
                this.processWinOpVaultItem(item, cipher);
            }
            this.convertToNoteIfNeeded(cipher);
            this.cleanupCipher(cipher);
            this.result.ciphers.push(cipher);
        });
        this.result.success = true;
        return this.result;
    }
    processWinOpVaultItem(item, cipher) {
        if (item.overview != null) {
            cipher.name = this.getValueOrDefault(item.overview.title);
            if (item.overview.URLs != null) {
                const urls = [];
                item.overview.URLs.forEach((url) => {
                    if (!this.isNullOrWhitespace(url.u)) {
                        urls.push(url.u);
                    }
                });
                cipher.login.uris = this.makeUriArray(urls);
            }
        }
        if (item.details != null) {
            if (!this.isNullOrWhitespace(item.details.ccnum) || !this.isNullOrWhitespace(item.details.cvv)) {
                cipher.type = cipherType_1.CipherType.Card;
                cipher.card = new cardView_1.CardView();
            }
            else if (!this.isNullOrWhitespace(item.details.firstname) ||
                !this.isNullOrWhitespace(item.details.address1)) {
                cipher.type = cipherType_1.CipherType.Identity;
                cipher.identity = new identityView_1.IdentityView();
            }
            if (cipher.type === cipherType_1.CipherType.Login && !this.isNullOrWhitespace(item.details.password)) {
                cipher.login.password = item.details.password;
            }
            if (!this.isNullOrWhitespace(item.details.notesPlain)) {
                cipher.notes = item.details.notesPlain.split(this.newLineRegex).join('\n') + '\n';
            }
            if (item.details.fields != null) {
                this.parseFields(item.details.fields, cipher, 'designation', 'value', 'name');
            }
            if (item.details.sections != null) {
                item.details.sections.forEach((section) => {
                    if (section.fields != null) {
                        this.parseFields(section.fields, cipher, 'n', 'v', 't');
                    }
                });
            }
            if (item.details.passwordHistory != null) {
                this.parsePasswordHistory(item.details.passwordHistory, cipher);
            }
        }
    }
    processStandardItem(item, cipher) {
        cipher.favorite = item.openContents && item.openContents.faveIndex ? true : false;
        cipher.name = this.getValueOrDefault(item.title);
        if (item.typeName === 'securenotes.SecureNote') {
            cipher.type = cipherType_1.CipherType.SecureNote;
            cipher.secureNote = new secureNoteView_1.SecureNoteView();
            cipher.secureNote.type = secureNoteType_1.SecureNoteType.Generic;
        }
        else if (item.typeName === 'wallet.financial.CreditCard') {
            cipher.type = cipherType_1.CipherType.Card;
            cipher.card = new cardView_1.CardView();
        }
        else if (item.typeName === 'identities.Identity') {
            cipher.type = cipherType_1.CipherType.Identity;
            cipher.identity = new identityView_1.IdentityView();
        }
        else {
            cipher.login.uris = this.makeUriArray(item.location);
        }
        if (item.secureContents != null) {
            if (!this.isNullOrWhitespace(item.secureContents.notesPlain)) {
                cipher.notes = item.secureContents.notesPlain.split(this.newLineRegex).join('\n') + '\n';
            }
            if (cipher.type === cipherType_1.CipherType.Login) {
                if (!this.isNullOrWhitespace(item.secureContents.password)) {
                    cipher.login.password = item.secureContents.password;
                }
                if (item.secureContents.URLs != null) {
                    const urls = [];
                    item.secureContents.URLs.forEach((u) => {
                        if (!this.isNullOrWhitespace(u.url)) {
                            urls.push(u.url);
                        }
                    });
                    if (urls.length > 0) {
                        cipher.login.uris = this.makeUriArray(urls);
                    }
                }
            }
            if (item.secureContents.fields != null) {
                this.parseFields(item.secureContents.fields, cipher, 'designation', 'value', 'name');
            }
            if (item.secureContents.sections != null) {
                item.secureContents.sections.forEach((section) => {
                    if (section.fields != null) {
                        this.parseFields(section.fields, cipher, 'n', 'v', 't');
                    }
                });
            }
            if (item.secureContents.passwordHistory != null) {
                this.parsePasswordHistory(item.secureContents.passwordHistory, cipher);
            }
        }
    }
    parsePasswordHistory(items, cipher) {
        const maxSize = items.length > 5 ? 5 : items.length;
        cipher.passwordHistory = items
            .filter((h) => !this.isNullOrWhitespace(h.value) && h.time != null)
            .sort((a, b) => b.time - a.time)
            .slice(0, maxSize)
            .map((h) => {
            const ph = new passwordHistoryView_1.PasswordHistoryView();
            ph.password = h.value;
            ph.lastUsedDate = new Date(h.time * 1000);
            return ph;
        });
    }
    parseFields(fields, cipher, designationKey, valueKey, nameKey) {
        fields.forEach((field) => {
            if (field[valueKey] == null || field[valueKey].toString().trim() === '') {
                return;
            }
            const fieldValue = field[valueKey].toString();
            const fieldDesignation = field[designationKey] != null ? field[designationKey].toString() : null;
            if (cipher.type === cipherType_1.CipherType.Login) {
                if (this.isNullOrWhitespace(cipher.login.username) && fieldDesignation === 'username') {
                    cipher.login.username = fieldValue;
                    return;
                }
                else if (this.isNullOrWhitespace(cipher.login.password) && fieldDesignation === 'password') {
                    cipher.login.password = fieldValue;
                    return;
                }
                else if (this.isNullOrWhitespace(cipher.login.totp) && fieldDesignation != null &&
                    fieldDesignation.startsWith('TOTP_')) {
                    cipher.login.totp = fieldValue;
                    return;
                }
            }
            else if (cipher.type === cipherType_1.CipherType.Card) {
                if (this.isNullOrWhitespace(cipher.card.number) && fieldDesignation === 'ccnum') {
                    cipher.card.number = fieldValue;
                    cipher.card.brand = this.getCardBrand(fieldValue);
                    return;
                }
                else if (this.isNullOrWhitespace(cipher.card.code) && fieldDesignation === 'cvv') {
                    cipher.card.code = fieldValue;
                    return;
                }
                else if (this.isNullOrWhitespace(cipher.card.cardholderName) && fieldDesignation === 'cardholder') {
                    cipher.card.cardholderName = fieldValue;
                    return;
                }
                else if (this.isNullOrWhitespace(cipher.card.expiration) && fieldDesignation === 'expiry' &&
                    fieldValue.length === 6) {
                    cipher.card.expMonth = fieldValue.substr(4, 2);
                    if (cipher.card.expMonth[0] === '0') {
                        cipher.card.expMonth = cipher.card.expMonth.substr(1, 1);
                    }
                    cipher.card.expYear = fieldValue.substr(0, 4);
                    return;
                }
                else if (fieldDesignation === 'type') {
                    // Skip since brand was determined from number above
                    return;
                }
            }
            else if (cipher.type === cipherType_1.CipherType.Identity) {
                const identity = cipher.identity;
                if (this.isNullOrWhitespace(identity.firstName) && fieldDesignation === 'firstname') {
                    identity.firstName = fieldValue;
                    return;
                }
                else if (this.isNullOrWhitespace(identity.lastName) && fieldDesignation === 'lastname') {
                    identity.lastName = fieldValue;
                    return;
                }
                else if (this.isNullOrWhitespace(identity.middleName) && fieldDesignation === 'initial') {
                    identity.middleName = fieldValue;
                    return;
                }
                else if (this.isNullOrWhitespace(identity.phone) && fieldDesignation === 'defphone') {
                    identity.phone = fieldValue;
                    return;
                }
                else if (this.isNullOrWhitespace(identity.company) && fieldDesignation === 'company') {
                    identity.company = fieldValue;
                    return;
                }
                else if (this.isNullOrWhitespace(identity.email) && fieldDesignation === 'email') {
                    identity.email = fieldValue;
                    return;
                }
                else if (this.isNullOrWhitespace(identity.username) && fieldDesignation === 'username') {
                    identity.username = fieldValue;
                    return;
                }
                else if (fieldDesignation === 'address') {
                    // fieldValue is an object casted into a string, so access the plain value instead
                    const { street, city, country, zip } = field[valueKey];
                    identity.address1 = this.getValueOrDefault(street);
                    identity.city = this.getValueOrDefault(city);
                    if (!this.isNullOrWhitespace(country)) {
                        identity.country = country.toUpperCase();
                    }
                    identity.postalCode = this.getValueOrDefault(zip);
                    return;
                }
            }
            const fieldType = field.k === 'concealed' ? fieldType_1.FieldType.Hidden : fieldType_1.FieldType.Text;
            const fieldName = this.isNullOrWhitespace(field[nameKey]) ? 'no_name' : field[nameKey];
            this.processKvp(cipher, fieldName, fieldValue, fieldType);
        });
    }
}
exports.OnePassword1PifImporter = OnePassword1PifImporter;
//# sourceMappingURL=onepassword1PifImporter.js.map