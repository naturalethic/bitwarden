"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class BlurCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, true);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            if (value.label === 'null') {
                value.label = null;
            }
            const cipher = this.initLoginCipher();
            cipher.name = this.getValueOrDefault(value.label, this.getValueOrDefault(this.nameFromUrl(value.domain), '--'));
            cipher.login.uris = this.makeUriArray(value.domain);
            cipher.login.password = this.getValueOrDefault(value.password);
            if (this.isNullOrWhitespace(value.email) && !this.isNullOrWhitespace(value.username)) {
                cipher.login.username = value.username;
            }
            else {
                cipher.login.username = this.getValueOrDefault(value.email);
                cipher.notes = this.getValueOrDefault(value.username);
            }
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        result.success = true;
        return result;
    }
}
exports.BlurCsvImporter = BlurCsvImporter;
//# sourceMappingURL=blurCsvImporter.js.map