"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class UpmCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, false);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            if (value.length !== 5) {
                return;
            }
            const cipher = this.initLoginCipher();
            cipher.name = this.getValueOrDefault(value[0], '--');
            cipher.notes = this.getValueOrDefault(value[4]);
            cipher.login.username = this.getValueOrDefault(value[1]);
            cipher.login.password = this.getValueOrDefault(value[2]);
            cipher.login.uris = this.makeUriArray(value[3]);
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        result.success = true;
        return result;
    }
}
exports.UpmCsvImporter = UpmCsvImporter;
//# sourceMappingURL=upmCsvImporter.js.map