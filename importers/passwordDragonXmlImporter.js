"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class PasswordDragonXmlImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const doc = this.parseXml(data);
        if (doc == null) {
            result.success = false;
            return result;
        }
        const records = doc.querySelectorAll('PasswordManager > record');
        Array.from(records).forEach((record) => {
            const category = this.querySelectorDirectChild(record, 'Category');
            const categoryText = category != null && !this.isNullOrWhitespace(category.textContent) &&
                category.textContent !== 'Unfiled' ? category.textContent : null;
            this.processFolder(result, categoryText);
            const accountName = this.querySelectorDirectChild(record, 'Account-Name');
            const userId = this.querySelectorDirectChild(record, 'User-Id');
            const password = this.querySelectorDirectChild(record, 'Password');
            const url = this.querySelectorDirectChild(record, 'URL');
            const notes = this.querySelectorDirectChild(record, 'Notes');
            const cipher = this.initLoginCipher();
            cipher.name = accountName != null ? this.getValueOrDefault(accountName.textContent, '--') : '--';
            cipher.notes = notes != null ? this.getValueOrDefault(notes.textContent) : '';
            cipher.login.username = userId != null ? this.getValueOrDefault(userId.textContent) : null;
            cipher.login.password = password != null ? this.getValueOrDefault(password.textContent) : null;
            cipher.login.uris = url != null ? this.makeUriArray(url.textContent) : null;
            const attributes = [];
            for (let i = 1; i <= 10; i++) {
                attributes.push('Attribute-' + i);
            }
            this.querySelectorAllDirectChild(record, attributes.join(',')).forEach((attr) => {
                if (this.isNullOrWhitespace(attr.textContent) || attr.textContent === 'null') {
                    return;
                }
                this.processKvp(cipher, attr.tagName, attr.textContent);
            });
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        if (this.organization) {
            this.moveFoldersToCollections(result);
        }
        result.success = true;
        return result;
    }
}
exports.PasswordDragonXmlImporter = PasswordDragonXmlImporter;
//# sourceMappingURL=passwordDragonXmlImporter.js.map