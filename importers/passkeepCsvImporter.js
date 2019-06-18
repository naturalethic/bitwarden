"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class PassKeepCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, true);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            this.processFolder(result, this.getValue('category', value));
            const cipher = this.initLoginCipher();
            cipher.notes = this.getValue('description', value);
            cipher.name = this.getValueOrDefault(this.getValue('title', value), '--');
            cipher.login.username = this.getValue('username', value);
            cipher.login.password = this.getValue('password', value);
            cipher.login.uris = this.makeUriArray(this.getValue('site', value));
            this.processKvp(cipher, 'Password 2', this.getValue('password2', value));
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        if (this.organization) {
            this.moveFoldersToCollections(result);
        }
        result.success = true;
        return result;
    }
    getValue(key, value) {
        return this.getValueOrDefault(value[key], this.getValueOrDefault(value[(' ' + key)]));
    }
}
exports.PassKeepCsvImporter = PassKeepCsvImporter;
//# sourceMappingURL=passkeepCsvImporter.js.map