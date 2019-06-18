"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const cardView_1 = require("../models/view/cardView");
const cipherView_1 = require("../models/view/cipherView");
const folderView_1 = require("../models/view/folderView");
const identityView_1 = require("../models/view/identityView");
const loginView_1 = require("../models/view/loginView");
const secureNoteView_1 = require("../models/view/secureNoteView");
const cipherType_1 = require("../enums/cipherType");
const secureNoteType_1 = require("../enums/secureNoteType");
class LastPassCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, true);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value, index) => {
            const cipherIndex = result.ciphers.length;
            let folderIndex = result.folders.length;
            let grouping = value.grouping;
            if (grouping != null) {
                grouping = grouping.replace(/\\/g, '/').replace(/[\x00-\x1F\x7F-\x9F]/g, '');
            }
            const hasFolder = this.getValueOrDefault(grouping, '(none)') !== '(none)';
            let addFolder = hasFolder;
            if (hasFolder) {
                for (let i = 0; i < result.folders.length; i++) {
                    if (result.folders[i].name === grouping) {
                        addFolder = false;
                        folderIndex = i;
                        break;
                    }
                }
            }
            const cipher = this.buildBaseCipher(value);
            if (cipher.type === cipherType_1.CipherType.Login) {
                cipher.notes = this.getValueOrDefault(value.extra);
                cipher.login = new loginView_1.LoginView();
                cipher.login.uris = this.makeUriArray(value.url);
                cipher.login.username = this.getValueOrDefault(value.username);
                cipher.login.password = this.getValueOrDefault(value.password);
            }
            else if (cipher.type === cipherType_1.CipherType.SecureNote) {
                this.parseSecureNote(value, cipher);
            }
            else if (cipher.type === cipherType_1.CipherType.Card) {
                cipher.card = this.parseCard(value);
                cipher.notes = this.getValueOrDefault(value.notes);
            }
            else if (cipher.type === cipherType_1.CipherType.Identity) {
                cipher.identity = this.parseIdentity(value);
                cipher.notes = this.getValueOrDefault(value.notes);
                if (!this.isNullOrWhitespace(value.ccnum)) {
                    // there is a card on this identity too
                    const cardCipher = this.buildBaseCipher(value);
                    cardCipher.identity = null;
                    cardCipher.type = cipherType_1.CipherType.Card;
                    cardCipher.card = this.parseCard(value);
                    result.ciphers.push(cardCipher);
                }
            }
            result.ciphers.push(cipher);
            if (addFolder) {
                const f = new folderView_1.FolderView();
                f.name = grouping;
                result.folders.push(f);
            }
            if (hasFolder) {
                result.folderRelationships.push([cipherIndex, folderIndex]);
            }
        });
        if (this.organization) {
            this.moveFoldersToCollections(result);
        }
        result.success = true;
        return result;
    }
    buildBaseCipher(value) {
        const cipher = new cipherView_1.CipherView();
        if (value.hasOwnProperty('profilename') && value.hasOwnProperty('profilelanguage')) {
            // form fill
            cipher.favorite = false;
            cipher.name = this.getValueOrDefault(value.profilename, '--');
            cipher.type = cipherType_1.CipherType.Card;
            if (!this.isNullOrWhitespace(value.title) || !this.isNullOrWhitespace(value.firstname) ||
                !this.isNullOrWhitespace(value.lastname) || !this.isNullOrWhitespace(value.address1) ||
                !this.isNullOrWhitespace(value.phone) || !this.isNullOrWhitespace(value.username) ||
                !this.isNullOrWhitespace(value.email)) {
                cipher.type = cipherType_1.CipherType.Identity;
            }
        }
        else {
            // site or secure note
            cipher.favorite = !this.organization && this.getValueOrDefault(value.fav, '0') === '1';
            cipher.name = this.getValueOrDefault(value.name, '--');
            cipher.type = value.url === 'http://sn' ? cipherType_1.CipherType.SecureNote : cipherType_1.CipherType.Login;
        }
        return cipher;
    }
    parseCard(value) {
        const card = new cardView_1.CardView();
        card.cardholderName = this.getValueOrDefault(value.ccname);
        card.number = this.getValueOrDefault(value.ccnum);
        card.code = this.getValueOrDefault(value.cccsc);
        card.brand = this.getCardBrand(value.ccnum);
        if (!this.isNullOrWhitespace(value.ccexp) && value.ccexp.indexOf('-') > -1) {
            const ccexpParts = value.ccexp.split('-');
            if (ccexpParts.length > 1) {
                card.expYear = ccexpParts[0];
                card.expMonth = ccexpParts[1];
                if (card.expMonth.length === 2 && card.expMonth[0] === '0') {
                    card.expMonth = card.expMonth[1];
                }
            }
        }
        return card;
    }
    parseIdentity(value) {
        const identity = new identityView_1.IdentityView();
        identity.title = this.getValueOrDefault(value.title);
        identity.firstName = this.getValueOrDefault(value.firstname);
        identity.middleName = this.getValueOrDefault(value.middlename);
        identity.lastName = this.getValueOrDefault(value.lastname);
        identity.username = this.getValueOrDefault(value.username);
        identity.company = this.getValueOrDefault(value.company);
        identity.ssn = this.getValueOrDefault(value.ssn);
        identity.address1 = this.getValueOrDefault(value.address1);
        identity.address2 = this.getValueOrDefault(value.address2);
        identity.address3 = this.getValueOrDefault(value.address3);
        identity.city = this.getValueOrDefault(value.city);
        identity.state = this.getValueOrDefault(value.state);
        identity.postalCode = this.getValueOrDefault(value.zip);
        identity.country = this.getValueOrDefault(value.country);
        identity.email = this.getValueOrDefault(value.email);
        identity.phone = this.getValueOrDefault(value.phone);
        if (!this.isNullOrWhitespace(identity.title)) {
            identity.title = identity.title.charAt(0).toUpperCase() + identity.title.slice(1);
        }
        return identity;
    }
    parseSecureNote(value, cipher) {
        const extraParts = this.splitNewLine(value.extra);
        let processedNote = false;
        if (extraParts.length) {
            const typeParts = extraParts[0].split(':');
            if (typeParts.length > 1 && typeParts[0] === 'NoteType' &&
                (typeParts[1] === 'Credit Card' || typeParts[1] === 'Address')) {
                if (typeParts[1] === 'Credit Card') {
                    const mappedData = this.parseSecureNoteMapping(extraParts, {
                        'Number': 'number',
                        'Name on Card': 'cardholderName',
                        'Security Code': 'code',
                    });
                    cipher.type = cipherType_1.CipherType.Card;
                    cipher.card = mappedData[0];
                    cipher.notes = mappedData[1];
                }
                else if (typeParts[1] === 'Address') {
                    const mappedData = this.parseSecureNoteMapping(extraParts, {
                        'Title': 'title',
                        'First Name': 'firstName',
                        'Last Name': 'lastName',
                        'Middle Name': 'middleName',
                        'Company': 'company',
                        'Address 1': 'address1',
                        'Address 2': 'address2',
                        'Address 3': 'address3',
                        'City / Town': 'city',
                        'State': 'state',
                        'Zip / Postal Code': 'postalCode',
                        'Country': 'country',
                        'Email Address': 'email',
                        'Username': 'username',
                    });
                    cipher.type = cipherType_1.CipherType.Identity;
                    cipher.identity = mappedData[0];
                    cipher.notes = mappedData[1];
                }
                processedNote = true;
            }
        }
        if (!processedNote) {
            cipher.secureNote = new secureNoteView_1.SecureNoteView();
            cipher.secureNote.type = secureNoteType_1.SecureNoteType.Generic;
            cipher.notes = this.getValueOrDefault(value.extra);
        }
    }
    parseSecureNoteMapping(extraParts, map) {
        let notes = null;
        const dataObj = {};
        let processingNotes = false;
        extraParts.forEach((extraPart) => {
            let key = null;
            let val = null;
            if (!processingNotes) {
                if (this.isNullOrWhitespace(extraPart)) {
                    return;
                }
                const colonIndex = extraPart.indexOf(':');
                if (colonIndex === -1) {
                    key = extraPart;
                }
                else {
                    key = extraPart.substring(0, colonIndex);
                    if (extraPart.length > colonIndex) {
                        val = extraPart.substring(colonIndex + 1);
                    }
                }
                if (this.isNullOrWhitespace(key) || this.isNullOrWhitespace(val) || key === 'NoteType') {
                    return;
                }
            }
            if (processingNotes) {
                notes += ('\n' + extraPart);
            }
            else if (key === 'Notes') {
                if (!this.isNullOrWhitespace(notes)) {
                    notes += ('\n' + val);
                }
                else {
                    notes = val;
                }
                processingNotes = true;
            }
            else if (map.hasOwnProperty(key)) {
                dataObj[map[key]] = val;
            }
            else {
                if (!this.isNullOrWhitespace(notes)) {
                    notes += '\n';
                }
                else {
                    notes = '';
                }
                notes += (key + ': ' + val);
            }
        });
        return [dataObj, notes];
    }
}
exports.LastPassCsvImporter = LastPassCsvImporter;
//# sourceMappingURL=lastpassCsvImporter.js.map