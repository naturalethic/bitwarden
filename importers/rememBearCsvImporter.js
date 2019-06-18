"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const cipherType_1 = require("../enums/cipherType");
const importResult_1 = require("../models/domain/importResult");
const cardView_1 = require("../models/view/cardView");
class RememBearCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, true);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            if (value.trash === 'true') {
                return;
            }
            const cipher = this.initLoginCipher();
            cipher.name = this.getValueOrDefault(value.name);
            cipher.notes = this.getValueOrDefault(value.notes);
            if (value.type === 'LoginItem') {
                cipher.login.uris = this.makeUriArray(value.website);
                cipher.login.password = this.getValueOrDefault(value.password);
                cipher.login.username = this.getValueOrDefault(value.username);
            }
            else if (value.type === 'CreditCardItem') {
                cipher.type = cipherType_1.CipherType.Card;
                cipher.card = new cardView_1.CardView();
                cipher.card.cardholderName = this.getValueOrDefault(value.cardholder);
                cipher.card.number = this.getValueOrDefault(value.number);
                cipher.card.brand = this.getCardBrand(cipher.card.number);
                cipher.card.code = this.getValueOrDefault(value.verification);
                try {
                    const expMonth = this.getValueOrDefault(value.expiryMonth);
                    if (expMonth != null) {
                        const expMonthNumber = parseInt(expMonth, null);
                        if (expMonthNumber != null && expMonthNumber >= 1 && expMonthNumber <= 12) {
                            cipher.card.expMonth = expMonthNumber.toString();
                        }
                    }
                }
                catch (_a) { }
                try {
                    const expYear = this.getValueOrDefault(value.expiryYear);
                    if (expYear != null) {
                        const expYearNumber = parseInt(expYear, null);
                        if (expYearNumber != null) {
                            cipher.card.expYear = expYearNumber.toString();
                        }
                    }
                }
                catch (_b) { }
                const pin = this.getValueOrDefault(value.pin);
                if (pin != null) {
                    this.processKvp(cipher, 'PIN', pin);
                }
                const zip = this.getValueOrDefault(value.zipCode);
                if (zip != null) {
                    this.processKvp(cipher, 'Zip Code', zip);
                }
            }
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        result.success = true;
        return result;
    }
}
exports.RememBearCsvImporter = RememBearCsvImporter;
//# sourceMappingURL=rememBearCsvImporter.js.map