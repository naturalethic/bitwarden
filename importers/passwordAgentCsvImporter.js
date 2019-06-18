"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class PasswordAgentCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, false);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            if (value.length < 9) {
                return;
            }
            const folder = this.getValueOrDefault(value[8], '(None)');
            const folderName = folder !== '(None)' ? folder.split('\\').join('/') : null;
            this.processFolder(result, folderName);
            const cipher = this.initLoginCipher();
            cipher.notes = this.getValueOrDefault(value[3]);
            cipher.name = this.getValueOrDefault(value[0], '--');
            cipher.login.username = this.getValueOrDefault(value[1]);
            cipher.login.password = this.getValueOrDefault(value[2]);
            cipher.login.uris = this.makeUriArray(value[4]);
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
exports.PasswordAgentCsvImporter = PasswordAgentCsvImporter;
//# sourceMappingURL=passwordAgentCsvImporter.js.map