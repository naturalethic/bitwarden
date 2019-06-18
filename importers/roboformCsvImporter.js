"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class RoboFormCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, true);
        if (results == null) {
            result.success = false;
            return result;
        }
        let i = 1;
        results.forEach((value) => {
            const folder = !this.isNullOrWhitespace(value.Folder) && value.Folder.startsWith('/') ?
                value.Folder.replace('/', '') : value.Folder;
            const folderName = !this.isNullOrWhitespace(folder) ? folder : null;
            this.processFolder(result, folderName);
            const cipher = this.initLoginCipher();
            cipher.notes = this.getValueOrDefault(value.Note);
            cipher.name = this.getValueOrDefault(value.Name, '--');
            cipher.login.username = this.getValueOrDefault(value.Login);
            cipher.login.password = this.getValueOrDefault(value.Pwd);
            cipher.login.uris = this.makeUriArray(value.Url);
            if (!this.isNullOrWhitespace(value.Rf_fields)) {
                let fields = [value.Rf_fields];
                if (value.__parsed_extra != null && value.__parsed_extra.length > 0) {
                    fields = fields.concat(value.__parsed_extra);
                }
                fields.forEach((field) => {
                    const parts = field.split(':');
                    if (parts.length < 3) {
                        return;
                    }
                    const key = parts[0] === '-no-name-' ? null : parts[0];
                    const val = parts.length === 4 && parts[2] === 'rck' ? parts[1] : parts[2];
                    this.processKvp(cipher, key, val);
                });
            }
            this.cleanupCipher(cipher);
            if (i === results.length && cipher.name === '--' && this.isNullOrWhitespace(cipher.login.password)) {
                return;
            }
            result.ciphers.push(cipher);
            i++;
        });
        if (this.organization) {
            this.moveFoldersToCollections(result);
        }
        result.success = true;
        return result;
    }
}
exports.RoboFormCsvImporter = RoboFormCsvImporter;
//# sourceMappingURL=roboformCsvImporter.js.map