"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class PasswordWalletTxtImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, false);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            if (value.length < 1) {
                return;
            }
            if (value.length > 5) {
                this.processFolder(result, value[5]);
            }
            const cipher = this.initLoginCipher();
            cipher.name = this.getValueOrDefault(value[0], '--');
            if (value.length > 4) {
                cipher.notes = this.getValueOrDefault(value[4], '').split('¬').join('\n');
            }
            if (value.length > 2) {
                cipher.login.username = this.getValueOrDefault(value[2]);
            }
            if (value.length > 3) {
                cipher.login.password = this.getValueOrDefault(value[3]);
            }
            if (value.length > 1) {
                cipher.login.uris = this.makeUriArray(value[1]);
            }
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
exports.PasswordWalletTxtImporter = PasswordWalletTxtImporter;
//# sourceMappingURL=passwordWalletTxtImporter.js.map