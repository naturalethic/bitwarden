"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class MeldiumCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, true);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            const cipher = this.initLoginCipher();
            cipher.name = this.getValueOrDefault(value.DisplayName, '--');
            cipher.notes = this.getValueOrDefault(value.Notes);
            cipher.login.username = this.getValueOrDefault(value.UserName);
            cipher.login.password = this.getValueOrDefault(value.Password);
            cipher.login.uris = this.makeUriArray(value.Url);
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        result.success = true;
        return result;
    }
}
exports.MeldiumCsvImporter = MeldiumCsvImporter;
//# sourceMappingURL=meldiumCsvImporter.js.map