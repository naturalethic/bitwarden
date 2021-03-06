"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class PassmanJsonImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = JSON.parse(data);
        if (results == null || results.length === 0) {
            result.success = false;
            return result;
        }
        results.forEach((credential) => {
            if (credential.tags != null && credential.tags.length > 0) {
                const folderName = credential.tags[0].text;
                this.processFolder(result, folderName);
            }
            const cipher = this.initLoginCipher();
            cipher.name = credential.label;
            cipher.login.username = this.getValueOrDefault(credential.username);
            if (this.isNullOrWhitespace(cipher.login.username)) {
                cipher.login.username = this.getValueOrDefault(credential.email);
            }
            else if (!this.isNullOrWhitespace(credential.email)) {
                cipher.notes = ('Email: ' + credential.email + '\n');
            }
            cipher.login.password = this.getValueOrDefault(credential.password);
            cipher.login.uris = this.makeUriArray(credential.url);
            cipher.notes += this.getValueOrDefault(credential.description, '');
            if (credential.otp != null) {
                cipher.login.totp = this.getValueOrDefault(credential.otp.secret);
            }
            if (credential.custom_fields != null) {
                credential.custom_fields.forEach((customField) => {
                    switch (customField.field_type) {
                        case 'text':
                        case 'password':
                            this.processKvp(cipher, customField.label, customField.value);
                            break;
                    }
                });
            }
            this.convertToNoteIfNeeded(cipher);
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
exports.PassmanJsonImporter = PassmanJsonImporter;
//# sourceMappingURL=passmanJsonImporter.js.map