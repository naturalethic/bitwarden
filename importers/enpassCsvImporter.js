"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const cipherType_1 = require("../enums/cipherType");
const secureNoteType_1 = require("../enums/secureNoteType");
const cardView_1 = require("../models/view/cardView");
const secureNoteView_1 = require("../models/view/secureNoteView");
class EnpassCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, false);
        if (results == null) {
            result.success = false;
            return result;
        }
        let firstRow = true;
        results.forEach((value) => {
            if (value.length < 2 || (firstRow && (value[0] === 'Title' || value[0] === 'title'))) {
                firstRow = false;
                return;
            }
            const cipher = this.initLoginCipher();
            cipher.notes = this.getValueOrDefault(value[value.length - 1]);
            cipher.name = this.getValueOrDefault(value[0], '--');
            if (value.length === 2 || (!this.containsField(value, 'username') &&
                !this.containsField(value, 'password') && !this.containsField(value, 'email') &&
                !this.containsField(value, 'url'))) {
                cipher.type = cipherType_1.CipherType.SecureNote;
                cipher.secureNote = new secureNoteView_1.SecureNoteView();
                cipher.secureNote.type = secureNoteType_1.SecureNoteType.Generic;
            }
            if (this.containsField(value, 'cardholder') && this.containsField(value, 'number') &&
                this.containsField(value, 'expiry date')) {
                cipher.type = cipherType_1.CipherType.Card;
                cipher.card = new cardView_1.CardView();
            }
            if (value.length > 2 && (value.length % 2) === 0) {
                for (let i = 0; i < value.length - 2; i += 2) {
                    const fieldValue = value[i + 2];
                    if (this.isNullOrWhitespace(fieldValue)) {
                        continue;
                    }
                    const fieldName = value[i + 1];
                    const fieldNameLower = fieldName.toLowerCase();
                    if (cipher.type === cipherType_1.CipherType.Login) {
                        if (fieldNameLower === 'url' && (cipher.login.uris == null || cipher.login.uris.length === 0)) {
                            cipher.login.uris = this.makeUriArray(fieldValue);
                            continue;
                        }
                        else if ((fieldNameLower === 'username' || fieldNameLower === 'email') &&
                            this.isNullOrWhitespace(cipher.login.username)) {
                            cipher.login.username = fieldValue;
                            continue;
                        }
                        else if (fieldNameLower === 'password' && this.isNullOrWhitespace(cipher.login.password)) {
                            cipher.login.password = fieldValue;
                            continue;
                        }
                        else if (fieldNameLower === 'totp' && this.isNullOrWhitespace(cipher.login.totp)) {
                            cipher.login.totp = fieldValue;
                            continue;
                        }
                    }
                    else if (cipher.type === cipherType_1.CipherType.Card) {
                        if (fieldNameLower === 'cardholder' && this.isNullOrWhitespace(cipher.card.cardholderName)) {
                            cipher.card.cardholderName = fieldValue;
                            continue;
                        }
                        else if (fieldNameLower === 'number' && this.isNullOrWhitespace(cipher.card.number)) {
                            cipher.card.number = fieldValue;
                            cipher.card.brand = this.getCardBrand(fieldValue);
                            continue;
                        }
                        else if (fieldNameLower === 'cvc' && this.isNullOrWhitespace(cipher.card.code)) {
                            cipher.card.code = fieldValue;
                            continue;
                        }
                        else if (fieldNameLower === 'expiry date' && this.isNullOrWhitespace(cipher.card.expMonth) &&
                            this.isNullOrWhitespace(cipher.card.expYear)) {
                            if (this.setCardExpiration(cipher, fieldValue)) {
                                continue;
                            }
                        }
                        else if (fieldNameLower === 'type') {
                            // Skip since brand was determined from number above
                            continue;
                        }
                    }
                    this.processKvp(cipher, fieldName, fieldValue);
                }
            }
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        result.success = true;
        return result;
    }
    containsField(fields, name) {
        if (fields == null || name == null) {
            return false;
        }
        return fields.filter((f) => !this.isNullOrWhitespace(f) &&
            f.toLowerCase() === name.toLowerCase()).length > 0;
    }
}
exports.EnpassCsvImporter = EnpassCsvImporter;
//# sourceMappingURL=enpassCsvImporter.js.map