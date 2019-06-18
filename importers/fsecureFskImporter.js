"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const cardView_1 = require("../models/view/cardView");
const cipherType_1 = require("../enums/cipherType");
class FSecureFskImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = JSON.parse(data);
        if (results == null || results.data == null) {
            result.success = false;
            return result;
        }
        for (const key in results.data) {
            if (!results.data.hasOwnProperty(key)) {
                continue;
            }
            const value = results.data[key];
            const cipher = this.initLoginCipher();
            cipher.name = this.getValueOrDefault(value.service);
            cipher.notes = this.getValueOrDefault(value.notes);
            if (value.style === 'website') {
                cipher.login.username = this.getValueOrDefault(value.username);
                cipher.login.password = this.getValueOrDefault(value.password);
                cipher.login.uris = this.makeUriArray(value.url);
            }
            else if (value.style === 'creditcard') {
                cipher.type = cipherType_1.CipherType.Card;
                cipher.card = new cardView_1.CardView();
                cipher.card.cardholderName = this.getValueOrDefault(value.username);
                cipher.card.number = this.getValueOrDefault(value.creditNumber);
                cipher.card.brand = this.getCardBrand(cipher.card.number);
                cipher.card.code = this.getValueOrDefault(value.creditCvv);
                if (!this.isNullOrWhitespace(value.creditExpiry)) {
                    if (!this.setCardExpiration(cipher, value.creditExpiry)) {
                        this.processKvp(cipher, 'Expiration', value.creditExpiry);
                    }
                }
                if (!this.isNullOrWhitespace(value.password)) {
                    this.processKvp(cipher, 'PIN', value.password);
                }
            }
            else {
                continue;
            }
            this.convertToNoteIfNeeded(cipher);
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        }
        result.success = true;
        return result;
    }
}
exports.FSecureFskImporter = FSecureFskImporter;
//# sourceMappingURL=fsecureFskImporter.js.map