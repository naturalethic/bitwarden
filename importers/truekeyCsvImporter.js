"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const cardView_1 = require("../models/view/cardView");
const secureNoteView_1 = require("../models/view/secureNoteView");
const cipherType_1 = require("../enums/cipherType");
const secureNoteType_1 = require("../enums/secureNoteType");
const PropertiesToIgnore = ['kind', 'autologin', 'favorite', 'hexcolor', 'protectedwithpassword', 'subdomainonly',
    'type', 'tk_export_version', 'note', 'title', 'document_content',
];
class TrueKeyCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, true);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            const cipher = this.initLoginCipher();
            cipher.favorite = this.getValueOrDefault(value.favorite, '').toLowerCase() === 'true';
            cipher.name = this.getValueOrDefault(value.name, '--');
            cipher.notes = this.getValueOrDefault(value.memo, '');
            cipher.login.username = this.getValueOrDefault(value.login);
            cipher.login.password = this.getValueOrDefault(value.password);
            cipher.login.uris = this.makeUriArray(value.url);
            if (value.kind !== 'login') {
                cipher.name = this.getValueOrDefault(value.title, '--');
                cipher.notes = this.getValueOrDefault(value.note, '');
            }
            if (value.kind === 'cc') {
                cipher.type = cipherType_1.CipherType.Card;
                cipher.card = new cardView_1.CardView();
                cipher.card.cardholderName = this.getValueOrDefault(value.cardholder);
                cipher.card.number = this.getValueOrDefault(value.number);
                cipher.card.brand = this.getCardBrand(cipher.card.number);
                if (!this.isNullOrWhitespace(value.expiryDate)) {
                    try {
                        const expDate = new Date(value.expiryDate);
                        cipher.card.expYear = expDate.getFullYear().toString();
                        cipher.card.expMonth = (expDate.getMonth() + 1).toString();
                    }
                    catch (_a) { }
                }
            }
            else if (value.kind !== 'login') {
                cipher.type = cipherType_1.CipherType.SecureNote;
                cipher.secureNote = new secureNoteView_1.SecureNoteView();
                cipher.secureNote.type = secureNoteType_1.SecureNoteType.Generic;
                if (!this.isNullOrWhitespace(cipher.notes)) {
                    cipher.notes = this.getValueOrDefault(value.document_content, '');
                }
                for (const property in value) {
                    if (value.hasOwnProperty(property) && PropertiesToIgnore.indexOf(property.toLowerCase()) < 0 &&
                        !this.isNullOrWhitespace(value[property])) {
                        this.processKvp(cipher, property, value[property]);
                    }
                }
            }
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        result.success = true;
        return result;
    }
}
exports.TrueKeyCsvImporter = TrueKeyCsvImporter;
//# sourceMappingURL=truekeyCsvImporter.js.map