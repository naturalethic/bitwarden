"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const cardView_1 = require("../models/view/cardView");
const cipherType_1 = require("../enums/cipherType");
class EnpassJsonImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = JSON.parse(data);
        if (results == null || results.items == null || results.items.length === 0) {
            result.success = false;
            return result;
        }
        results.items.forEach((item) => {
            const cipher = this.initLoginCipher();
            cipher.name = this.getValueOrDefault(item.title);
            cipher.favorite = item.favorite > 0;
            if (item.template_type != null && item.fields != null && item.fields.length > 0) {
                if (item.template_type.indexOf('login.') === 0 || item.template_type.indexOf('password.') === 0) {
                    this.processLogin(cipher, item.fields);
                }
                else if (item.template_type.indexOf('creditcard.') === 0) {
                    this.processCard(cipher, item.fields);
                }
                else if (item.template_type.indexOf('identity.') < 0 &&
                    item.fields.some((f) => f.type === 'password' && !this.isNullOrWhitespace(f.value))) {
                    this.processLogin(cipher, item.fields);
                }
                else {
                    this.processNote(cipher, item.fields);
                }
            }
            cipher.notes += ('\n' + this.getValueOrDefault(item.note, ''));
            this.convertToNoteIfNeeded(cipher);
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        result.success = true;
        return result;
    }
    processLogin(cipher, fields) {
        const urls = [];
        fields.forEach((field) => {
            if (this.isNullOrWhitespace(field.value) || field.type === 'section') {
                return;
            }
            if ((field.type === 'username' || field.type === 'email') &&
                this.isNullOrWhitespace(cipher.login.username)) {
                cipher.login.username = field.value;
            }
            else if (field.type === 'password' && this.isNullOrWhitespace(cipher.login.password)) {
                cipher.login.password = field.value;
            }
            else if (field.type === 'totp' && this.isNullOrWhitespace(cipher.login.totp)) {
                cipher.login.totp = field.value;
            }
            else if (field.type === 'url') {
                urls.push(field.value);
            }
            else {
                this.processKvp(cipher, field.label, field.value);
            }
        });
        cipher.login.uris = this.makeUriArray(urls);
    }
    processCard(cipher, fields) {
        cipher.card = new cardView_1.CardView();
        cipher.type = cipherType_1.CipherType.Card;
        fields.forEach((field) => {
            if (this.isNullOrWhitespace(field.value) || field.type === 'section' || field.type === 'ccType') {
                return;
            }
            if (field.type === 'ccName' && this.isNullOrWhitespace(cipher.card.cardholderName)) {
                cipher.card.cardholderName = field.value;
            }
            else if (field.type === 'ccNumber' && this.isNullOrWhitespace(cipher.card.number)) {
                cipher.card.number = field.value;
                cipher.card.brand = this.getCardBrand(cipher.card.number);
            }
            else if (field.type === 'ccCvc' && this.isNullOrWhitespace(cipher.card.code)) {
                cipher.card.code = field.value;
            }
            else if (field.type === 'ccExpiry' && this.isNullOrWhitespace(cipher.card.expYear)) {
                if (!this.setCardExpiration(cipher, field.value)) {
                    this.processKvp(cipher, field.label, field.value);
                }
            }
            else {
                this.processKvp(cipher, field.label, field.value);
            }
        });
    }
    processNote(cipher, fields) {
        fields.forEach((field) => {
            if (this.isNullOrWhitespace(field.value) || field.type === 'section') {
                return;
            }
            this.processKvp(cipher, field.label, field.value);
        });
    }
}
exports.EnpassJsonImporter = EnpassJsonImporter;
//# sourceMappingURL=enpassJsonImporter.js.map