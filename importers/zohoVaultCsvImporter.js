"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class ZohoVaultCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, true);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            if (this.isNullOrWhitespace(value['Secret Name'])) {
                return;
            }
            this.processFolder(result, this.getValueOrDefault(value.ChamberName));
            const cipher = this.initLoginCipher();
            cipher.favorite = this.getValueOrDefault(value.Favorite, '0') === '1';
            cipher.notes = this.getValueOrDefault(value.Notes);
            cipher.name = this.getValueOrDefault(value['Secret Name'], '--');
            cipher.login.uris = this.makeUriArray(value['Secret URL']);
            this.parseData(cipher, value.SecretData);
            this.parseData(cipher, value.CustomData);
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
    parseData(cipher, data) {
        if (this.isNullOrWhitespace(data)) {
            return;
        }
        const dataLines = this.splitNewLine(data);
        dataLines.forEach((line) => {
            const delimPosition = line.indexOf(':');
            if (delimPosition < 0) {
                return;
            }
            const field = line.substring(0, delimPosition);
            const value = line.length > delimPosition ? line.substring(delimPosition + 1) : null;
            if (this.isNullOrWhitespace(field) || this.isNullOrWhitespace(value) || field === 'SecretType') {
                return;
            }
            const fieldLower = field.toLowerCase();
            if (cipher.login.username == null && this.usernameFieldNames.indexOf(fieldLower) > -1) {
                cipher.login.username = value;
            }
            else if (cipher.login.password == null && this.passwordFieldNames.indexOf(fieldLower) > -1) {
                cipher.login.password = value;
            }
            else {
                this.processKvp(cipher, field, value);
            }
        });
    }
}
exports.ZohoVaultCsvImporter = ZohoVaultCsvImporter;
//# sourceMappingURL=zohoVaultCsvImporter.js.map