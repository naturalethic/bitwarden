"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const cardView_1 = require("../models/view/cardView");
const cipherView_1 = require("../models/view/cipherView");
const identityView_1 = require("../models/view/identityView");
const secureNoteView_1 = require("../models/view/secureNoteView");
const cipherType_1 = require("../enums/cipherType");
const secureNoteType_1 = require("../enums/secureNoteType");
const HandledResults = new Set(['ADDRESS', 'AUTHENTIFIANT', 'BANKSTATEMENT', 'IDCARD', 'IDENTITY',
    'PAYMENTMEANS_CREDITCARD', 'PAYMENTMEAN_PAYPAL', 'EMAIL']);
class DashlaneJsonImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        this.result = new importResult_1.ImportResult();
        const results = JSON.parse(data);
        if (results == null || results.length === 0) {
            this.result.success = false;
            return this.result;
        }
        if (results.ADDRESS != null) {
            this.processAddress(results.ADDRESS);
        }
        if (results.AUTHENTIFIANT != null) {
            this.processAuth(results.AUTHENTIFIANT);
        }
        if (results.BANKSTATEMENT != null) {
            this.processNote(results.BANKSTATEMENT, 'BankAccountName');
        }
        if (results.IDCARD != null) {
            this.processNote(results.IDCARD, 'Fullname');
        }
        if (results.PAYMENTMEANS_CREDITCARD != null) {
            this.processCard(results.PAYMENTMEANS_CREDITCARD);
        }
        if (results.IDENTITY != null) {
            this.processIdentity(results.IDENTITY);
        }
        for (const key in results) {
            if (results.hasOwnProperty(key) && !HandledResults.has(key)) {
                this.processNote(results[key], null, 'Generic Note');
            }
        }
        this.result.success = true;
        return this.result;
    }
    processAuth(results) {
        results.forEach((credential) => {
            const cipher = this.initLoginCipher();
            cipher.name = this.getValueOrDefault(credential.title);
            cipher.login.username = this.getValueOrDefault(credential.login, this.getValueOrDefault(credential.secondaryLogin));
            if (this.isNullOrWhitespace(cipher.login.username)) {
                cipher.login.username = this.getValueOrDefault(credential.email);
            }
            else if (!this.isNullOrWhitespace(credential.email)) {
                cipher.notes = ('Email: ' + credential.email + '\n');
            }
            cipher.login.password = this.getValueOrDefault(credential.password);
            cipher.login.uris = this.makeUriArray(credential.domain);
            cipher.notes += this.getValueOrDefault(credential.note, '');
            this.convertToNoteIfNeeded(cipher);
            this.cleanupCipher(cipher);
            this.result.ciphers.push(cipher);
        });
    }
    processIdentity(results) {
        results.forEach((obj) => {
            const cipher = new cipherView_1.CipherView();
            cipher.identity = new identityView_1.IdentityView();
            cipher.type = cipherType_1.CipherType.Identity;
            cipher.name = this.getValueOrDefault(obj.fullName, '');
            const nameParts = cipher.name.split(' ');
            if (nameParts.length > 0) {
                cipher.identity.firstName = this.getValueOrDefault(nameParts[0]);
            }
            if (nameParts.length === 2) {
                cipher.identity.lastName = this.getValueOrDefault(nameParts[1]);
            }
            else if (nameParts.length === 3) {
                cipher.identity.middleName = this.getValueOrDefault(nameParts[1]);
                cipher.identity.lastName = this.getValueOrDefault(nameParts[2]);
            }
            cipher.identity.username = this.getValueOrDefault(obj.pseudo);
            this.cleanupCipher(cipher);
            this.result.ciphers.push(cipher);
        });
    }
    processAddress(results) {
        results.forEach((obj) => {
            const cipher = new cipherView_1.CipherView();
            cipher.identity = new identityView_1.IdentityView();
            cipher.type = cipherType_1.CipherType.Identity;
            cipher.name = this.getValueOrDefault(obj.addressName);
            cipher.identity.address1 = this.getValueOrDefault(obj.addressFull);
            cipher.identity.city = this.getValueOrDefault(obj.city);
            cipher.identity.state = this.getValueOrDefault(obj.state);
            cipher.identity.postalCode = this.getValueOrDefault(obj.zipcode);
            cipher.identity.country = this.getValueOrDefault(obj.country);
            if (cipher.identity.country != null) {
                cipher.identity.country = cipher.identity.country.toUpperCase();
            }
            this.cleanupCipher(cipher);
            this.result.ciphers.push(cipher);
        });
    }
    processCard(results) {
        results.forEach((obj) => {
            const cipher = new cipherView_1.CipherView();
            cipher.card = new cardView_1.CardView();
            cipher.type = cipherType_1.CipherType.Card;
            cipher.name = this.getValueOrDefault(obj.bank);
            cipher.card.number = this.getValueOrDefault(obj.cardNumber);
            cipher.card.brand = this.getCardBrand(cipher.card.number);
            cipher.card.cardholderName = this.getValueOrDefault(obj.owner);
            if (!this.isNullOrWhitespace(cipher.card.brand)) {
                if (this.isNullOrWhitespace(cipher.name)) {
                    cipher.name = cipher.card.brand;
                }
                else {
                    cipher.name += (' - ' + cipher.card.brand);
                }
            }
            this.cleanupCipher(cipher);
            this.result.ciphers.push(cipher);
        });
    }
    processNote(results, nameProperty, name = null) {
        results.forEach((obj) => {
            const cipher = new cipherView_1.CipherView();
            cipher.secureNote = new secureNoteView_1.SecureNoteView();
            cipher.type = cipherType_1.CipherType.SecureNote;
            cipher.secureNote.type = secureNoteType_1.SecureNoteType.Generic;
            if (name != null) {
                cipher.name = name;
            }
            else {
                cipher.name = this.getValueOrDefault(obj[nameProperty]);
            }
            for (const key in obj) {
                if (obj.hasOwnProperty(key) && key !== nameProperty) {
                    this.processKvp(cipher, key, obj[key].toString());
                }
            }
            this.cleanupCipher(cipher);
            this.result.ciphers.push(cipher);
        });
    }
}
exports.DashlaneJsonImporter = DashlaneJsonImporter;
//# sourceMappingURL=dashlaneJsonImporter.js.map