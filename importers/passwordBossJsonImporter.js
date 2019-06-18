"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const cardView_1 = require("../models/view/cardView");
const cipherType_1 = require("../enums/cipherType");
class PasswordBossJsonImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = JSON.parse(data);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            const cipher = this.initLoginCipher();
            cipher.name = this.getValueOrDefault(value.name, '--');
            cipher.login.uris = this.makeUriArray(value.login_url);
            if (value.identifiers == null) {
                return;
            }
            if (!this.isNullOrWhitespace(value.identifiers.notes)) {
                cipher.notes = value.identifiers.notes.split('\\r\\n').join('\n').split('\\n').join('\n');
            }
            if (value.type === 'CreditCard') {
                cipher.card = new cardView_1.CardView();
                cipher.type = cipherType_1.CipherType.Card;
            }
            for (const property in value.identifiers) {
                if (!value.identifiers.hasOwnProperty(property)) {
                    continue;
                }
                const valObj = value.identifiers[property];
                const val = valObj != null ? valObj.toString() : null;
                if (this.isNullOrWhitespace(val) || property === 'notes' || property === 'ignoreItemInSecurityScore') {
                    continue;
                }
                if (cipher.type === cipherType_1.CipherType.Card) {
                    if (property === 'cardNumber') {
                        cipher.card.number = val;
                        cipher.card.brand = this.getCardBrand(val);
                        continue;
                    }
                    else if (property === 'nameOnCard') {
                        cipher.card.cardholderName = val;
                        continue;
                    }
                    else if (property === 'security_code') {
                        cipher.card.code = val;
                        continue;
                    }
                    else if (property === 'expires') {
                        try {
                            const expDate = new Date(val);
                            cipher.card.expYear = expDate.getFullYear().toString();
                            cipher.card.expMonth = (expDate.getMonth() + 1).toString();
                        }
                        catch (_a) { }
                        continue;
                    }
                    else if (property === 'cardType') {
                        continue;
                    }
                }
                else {
                    if (property === 'username') {
                        cipher.login.username = val;
                        continue;
                    }
                    else if (property === 'password') {
                        cipher.login.password = val;
                        continue;
                    }
                    else if ((cipher.login.uris == null || cipher.login.uris.length === 0) &&
                        this.uriFieldNames.indexOf(property) > -1) {
                        cipher.login.uris = this.makeUriArray(val);
                        continue;
                    }
                }
                this.processKvp(cipher, property, val);
            }
            this.convertToNoteIfNeeded(cipher);
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        result.success = true;
        return result;
    }
}
exports.PasswordBossJsonImporter = PasswordBossJsonImporter;
//# sourceMappingURL=passwordBossJsonImporter.js.map