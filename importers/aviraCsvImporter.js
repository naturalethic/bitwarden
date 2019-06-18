"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class AviraCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, true);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            const cipher = this.initLoginCipher();
            cipher.name = this.getValueOrDefault(value.name, this.getValueOrDefault(this.nameFromUrl(value.website), '--'));
            cipher.login.uris = this.makeUriArray(value.website);
            cipher.login.password = this.getValueOrDefault(value.password);
            if (this.isNullOrWhitespace(value.username) && !this.isNullOrWhitespace(value.secondary_username)) {
                cipher.login.username = value.secondary_username;
            }
            else {
                cipher.login.username = this.getValueOrDefault(value.username);
                cipher.notes = this.getValueOrDefault(value.secondary_username);
            }
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        result.success = true;
        return result;
    }
}
exports.AviraCsvImporter = AviraCsvImporter;
//# sourceMappingURL=aviraCsvImporter.js.map