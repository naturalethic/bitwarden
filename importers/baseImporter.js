"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const papa = require("papaparse");
const cipherView_1 = require("../models/view/cipherView");
const collectionView_1 = require("../models/view/collectionView");
const loginUriView_1 = require("../models/view/loginUriView");
const utils_1 = require("../misc/utils");
const fieldView_1 = require("../models/view/fieldView");
const folderView_1 = require("../models/view/folderView");
const loginView_1 = require("../models/view/loginView");
const secureNoteView_1 = require("../models/view/secureNoteView");
const cipherType_1 = require("../enums/cipherType");
const fieldType_1 = require("../enums/fieldType");
const secureNoteType_1 = require("../enums/secureNoteType");
class BaseImporter {
    constructor() {
        this.organization = false;
        this.newLineRegex = /(?:\r\n|\r|\n)/;
        this.passwordFieldNames = [
            'password', 'pass word', 'passphrase', 'pass phrase',
            'pass', 'code', 'code word', 'codeword',
            'secret', 'secret word', 'personpwd',
            'key', 'keyword', 'key word', 'keyphrase', 'key phrase',
            'form_pw', 'wppassword', 'pin', 'pwd', 'pw', 'pword', 'passwd',
            'p', 'serial', 'serial#', 'license key', 'reg #',
            // Non-English names
            'passwort',
        ];
        this.usernameFieldNames = [
            'user', 'name', 'user name', 'username', 'login name',
            'email', 'e-mail', 'id', 'userid', 'user id',
            'login', 'form_loginname', 'wpname', 'mail',
            'loginid', 'login id', 'log', 'personlogin',
            'first name', 'last name', 'card#', 'account #',
            'member', 'member #',
            // Non-English names
            'nom', 'benutzername',
        ];
        this.notesFieldNames = [
            'note', 'notes', 'comment', 'comments', 'memo',
            'description', 'free form', 'freeform',
            'free text', 'freetext', 'free',
            // Non-English names
            'kommentar',
        ];
        this.uriFieldNames = [
            'url', 'hyper link', 'hyperlink', 'link',
            'host', 'hostname', 'host name', 'server', 'address',
            'hyper ref', 'href', 'web', 'website', 'web site', 'site',
            'web-site', 'uri',
            // Non-English names
            'ort', 'adresse',
        ];
    }
    parseXml(data) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'application/xml');
        return doc != null && doc.querySelector('parsererror') == null ? doc : null;
    }
    parseCsv(data, header) {
        data = this.splitNewLine(data).join('\n').trim();
        const result = papa.parse(data, {
            header: header,
            encoding: 'UTF-8',
            skipEmptyLines: false,
        });
        if (result.errors != null && result.errors.length > 0) {
            result.errors.forEach((e) => {
                if (e.row != null) {
                    // tslint:disable-next-line
                    console.warn('Error parsing row ' + e.row + ': ' + e.message);
                }
            });
        }
        return result.data && result.data.length > 0 ? result.data : null;
    }
    parseSingleRowCsv(rowData) {
        if (this.isNullOrWhitespace(rowData)) {
            return null;
        }
        const parsedRow = this.parseCsv(rowData, false);
        if (parsedRow != null && parsedRow.length > 0 && parsedRow[0].length > 0) {
            return parsedRow[0];
        }
        return null;
    }
    makeUriArray(uri) {
        if (uri == null) {
            return null;
        }
        if (typeof uri === 'string') {
            const loginUri = new loginUriView_1.LoginUriView();
            loginUri.uri = this.fixUri(uri);
            if (this.isNullOrWhitespace(loginUri.uri)) {
                return null;
            }
            loginUri.match = null;
            return [loginUri];
        }
        if (uri.length > 0) {
            const returnArr = [];
            uri.forEach((u) => {
                const loginUri = new loginUriView_1.LoginUriView();
                loginUri.uri = this.fixUri(u);
                if (this.isNullOrWhitespace(loginUri.uri)) {
                    return;
                }
                loginUri.match = null;
                returnArr.push(loginUri);
            });
            return returnArr.length === 0 ? null : returnArr;
        }
        return null;
    }
    fixUri(uri) {
        if (uri == null) {
            return null;
        }
        uri = uri.trim();
        if (uri.indexOf('://') === -1 && uri.indexOf('.') >= 0) {
            uri = 'http://' + uri;
        }
        if (uri.length > 1000) {
            return uri.substring(0, 1000);
        }
        return uri;
    }
    nameFromUrl(url) {
        const hostname = utils_1.Utils.getHostname(url);
        if (this.isNullOrWhitespace(hostname)) {
            return null;
        }
        return hostname.startsWith('www.') ? hostname.replace('www.', '') : hostname;
    }
    isNullOrWhitespace(str) {
        return utils_1.Utils.isNullOrWhitespace(str);
    }
    getValueOrDefault(str, defaultValue = null) {
        if (this.isNullOrWhitespace(str)) {
            return defaultValue;
        }
        return str;
    }
    splitNewLine(str) {
        return str.split(this.newLineRegex);
    }
    // ref https://stackoverflow.com/a/5911300
    getCardBrand(cardNum) {
        if (this.isNullOrWhitespace(cardNum)) {
            return null;
        }
        // Visa
        let re = new RegExp('^4');
        if (cardNum.match(re) != null) {
            return 'Visa';
        }
        // Mastercard
        // Updated for Mastercard 2017 BINs expansion
        if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/
            .test(cardNum)) {
            return 'Mastercard';
        }
        // AMEX
        re = new RegExp('^3[47]');
        if (cardNum.match(re) != null) {
            return 'Amex';
        }
        // Discover
        re = new RegExp('^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)');
        if (cardNum.match(re) != null) {
            return 'Discover';
        }
        // Diners
        re = new RegExp('^36');
        if (cardNum.match(re) != null) {
            return 'Diners Club';
        }
        // Diners - Carte Blanche
        re = new RegExp('^30[0-5]');
        if (cardNum.match(re) != null) {
            return 'Diners Club';
        }
        // JCB
        re = new RegExp('^35(2[89]|[3-8][0-9])');
        if (cardNum.match(re) != null) {
            return 'JCB';
        }
        // Visa Electron
        re = new RegExp('^(4026|417500|4508|4844|491(3|7))');
        if (cardNum.match(re) != null) {
            return 'Visa';
        }
        return null;
    }
    setCardExpiration(cipher, expiration) {
        if (!this.isNullOrWhitespace(expiration)) {
            const parts = expiration.split('/');
            if (parts.length === 2) {
                let month = null;
                let year = null;
                if (parts[0].length === 1 || parts[0].length === 2) {
                    month = parts[0];
                    if (month.length === 2 && month[0] === '0') {
                        month = month.substr(1, 1);
                    }
                }
                if (parts[1].length === 2 || parts[1].length === 4) {
                    year = month.length === 2 ? '20' + parts[1] : parts[1];
                }
                if (month != null && year != null) {
                    cipher.card.expMonth = month;
                    cipher.card.expYear = year;
                    return true;
                }
            }
        }
        return false;
    }
    moveFoldersToCollections(result) {
        result.folderRelationships.forEach((r) => result.collectionRelationships.push(r));
        result.collections = result.folders.map((f) => {
            const collection = new collectionView_1.CollectionView();
            collection.name = f.name;
            return collection;
        });
        result.folderRelationships = [];
        result.folders = [];
    }
    querySelectorDirectChild(parentEl, query) {
        const els = this.querySelectorAllDirectChild(parentEl, query);
        return els.length === 0 ? null : els[0];
    }
    querySelectorAllDirectChild(parentEl, query) {
        return Array.from(parentEl.querySelectorAll(query)).filter((el) => el.parentNode === parentEl);
    }
    initLoginCipher() {
        const cipher = new cipherView_1.CipherView();
        cipher.favorite = false;
        cipher.notes = '';
        cipher.fields = [];
        cipher.login = new loginView_1.LoginView();
        cipher.type = cipherType_1.CipherType.Login;
        return cipher;
    }
    cleanupCipher(cipher) {
        if (cipher == null) {
            return;
        }
        if (cipher.type !== cipherType_1.CipherType.Login) {
            cipher.login = null;
        }
        if (this.isNullOrWhitespace(cipher.name)) {
            cipher.name = '--';
        }
        if (this.isNullOrWhitespace(cipher.notes)) {
            cipher.notes = null;
        }
        else {
            cipher.notes = cipher.notes.trim();
        }
        if (cipher.fields != null && cipher.fields.length === 0) {
            cipher.fields = null;
        }
    }
    processKvp(cipher, key, value, type = fieldType_1.FieldType.Text) {
        if (this.isNullOrWhitespace(value)) {
            return;
        }
        if (this.isNullOrWhitespace(key)) {
            key = '';
        }
        if (value.length > 200 || value.trim().search(this.newLineRegex) > -1) {
            if (cipher.notes == null) {
                cipher.notes = '';
            }
            cipher.notes += (key + ': ' + this.splitNewLine(value).join('\n') + '\n');
        }
        else {
            if (cipher.fields == null) {
                cipher.fields = [];
            }
            const field = new fieldView_1.FieldView();
            field.type = type;
            field.name = key;
            field.value = value;
            cipher.fields.push(field);
        }
    }
    processFolder(result, folderName) {
        let folderIndex = result.folders.length;
        const hasFolder = !this.isNullOrWhitespace(folderName);
        let addFolder = hasFolder;
        if (hasFolder) {
            for (let i = 0; i < result.folders.length; i++) {
                if (result.folders[i].name === folderName) {
                    addFolder = false;
                    folderIndex = i;
                    break;
                }
            }
        }
        if (addFolder) {
            const f = new folderView_1.FolderView();
            f.name = folderName;
            result.folders.push(f);
        }
        if (hasFolder) {
            result.folderRelationships.push([result.ciphers.length, folderIndex]);
        }
    }
    convertToNoteIfNeeded(cipher) {
        if (cipher.type === cipherType_1.CipherType.Login && this.isNullOrWhitespace(cipher.login.username) &&
            this.isNullOrWhitespace(cipher.login.password) &&
            (cipher.login.uris == null || cipher.login.uris.length === 0)) {
            cipher.type = cipherType_1.CipherType.SecureNote;
            cipher.secureNote = new secureNoteView_1.SecureNoteView();
            cipher.secureNote.type = secureNoteType_1.SecureNoteType.Generic;
        }
    }
}
exports.BaseImporter = BaseImporter;
//# sourceMappingURL=baseImporter.js.map