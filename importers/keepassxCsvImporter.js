"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class KeePassXCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, true);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            if (this.isNullOrWhitespace(value.Title)) {
                return;
            }
            value.Group = !this.isNullOrWhitespace(value.Group) && value.Group.startsWith('Root/') ?
                value.Group.replace('Root/', '') : value.Group;
            const groupName = !this.isNullOrWhitespace(value.Group) ? value.Group : null;
            this.processFolder(result, groupName);
            const cipher = this.initLoginCipher();
            cipher.notes = this.getValueOrDefault(value.Notes);
            cipher.name = this.getValueOrDefault(value.Title, '--');
            cipher.login.username = this.getValueOrDefault(value.Username);
            cipher.login.password = this.getValueOrDefault(value.Password);
            cipher.login.uris = this.makeUriArray(value.URL);
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
exports.KeePassXCsvImporter = KeePassXCsvImporter;
//# sourceMappingURL=keepassxCsvImporter.js.map