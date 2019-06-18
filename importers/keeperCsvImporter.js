"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class KeeperCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, false);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            if (value.length < 6) {
                return;
            }
            this.processFolder(result, value[0]);
            const cipher = this.initLoginCipher();
            cipher.notes = this.getValueOrDefault(value[5]) + '\n';
            cipher.name = this.getValueOrDefault(value[1], '--');
            cipher.login.username = this.getValueOrDefault(value[2]);
            cipher.login.password = this.getValueOrDefault(value[3]);
            cipher.login.uris = this.makeUriArray(value[4]);
            if (value.length > 7) {
                // we have some custom fields.
                for (let i = 7; i < value.length; i = i + 2) {
                    this.processKvp(cipher, value[i], value[i + 1]);
                }
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
exports.KeeperCsvImporter = KeeperCsvImporter;
//# sourceMappingURL=keeperCsvImporter.js.map