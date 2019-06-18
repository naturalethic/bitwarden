"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class SplashIdCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, false);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            if (value.length < 3) {
                return;
            }
            this.processFolder(result, this.getValueOrDefault(value[value.length - 1]));
            const cipher = this.initLoginCipher();
            cipher.notes = this.getValueOrDefault(value[value.length - 2], '');
            cipher.name = this.getValueOrDefault(value[1], '--');
            if (value[0] === 'Web Logins' || value[0] === 'Servers' || value[0] === 'Email Accounts') {
                cipher.login.username = this.getValueOrDefault(value[2]);
                cipher.login.password = this.getValueOrDefault(value[3]);
                cipher.login.uris = this.makeUriArray(value[4]);
                this.parseFieldsToNotes(cipher, 5, value);
            }
            else {
                this.parseFieldsToNotes(cipher, 2, value);
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
    parseFieldsToNotes(cipher, startIndex, value) {
        // last 3 rows do not get parsed
        for (let i = startIndex; i < value.length - 3; i++) {
            if (this.isNullOrWhitespace(value[i])) {
                continue;
            }
            cipher.notes += (value[i] + '\n');
        }
    }
}
exports.SplashIdCsvImporter = SplashIdCsvImporter;
//# sourceMappingURL=splashIdCsvImporter.js.map