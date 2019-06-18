"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class AscendoCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, false);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            if (value.length < 2) {
                return;
            }
            const cipher = this.initLoginCipher();
            cipher.notes = this.getValueOrDefault(value[value.length - 1]);
            cipher.name = this.getValueOrDefault(value[0], '--');
            if (value.length > 2 && (value.length % 2) === 0) {
                for (let i = 0; i < value.length - 2; i += 2) {
                    const val = value[i + 2];
                    const field = value[i + 1];
                    if (this.isNullOrWhitespace(val) || this.isNullOrWhitespace(field)) {
                        continue;
                    }
                    const fieldLower = field.toLowerCase();
                    if (cipher.login.password == null && this.passwordFieldNames.indexOf(fieldLower) > -1) {
                        cipher.login.password = this.getValueOrDefault(val);
                    }
                    else if (cipher.login.username == null &&
                        this.usernameFieldNames.indexOf(fieldLower) > -1) {
                        cipher.login.username = this.getValueOrDefault(val);
                    }
                    else if ((cipher.login.uris == null || cipher.login.uris.length === 0) &&
                        this.uriFieldNames.indexOf(fieldLower) > -1) {
                        cipher.login.uris = this.makeUriArray(val);
                    }
                    else {
                        this.processKvp(cipher, field, val);
                    }
                }
            }
            this.convertToNoteIfNeeded(cipher);
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        result.success = true;
        return result;
    }
}
exports.AscendoCsvImporter = AscendoCsvImporter;
//# sourceMappingURL=ascendoCsvImporter.js.map