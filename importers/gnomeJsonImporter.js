"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
class GnomeJsonImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = JSON.parse(data);
        if (results == null || Object.keys(results).length === 0) {
            result.success = false;
            return result;
        }
        for (const keyRing in results) {
            if (!results.hasOwnProperty(keyRing) || this.isNullOrWhitespace(keyRing) ||
                results[keyRing].length === 0) {
                continue;
            }
            results[keyRing].forEach((value) => {
                if (this.isNullOrWhitespace(value.display_name) || value.display_name.indexOf('http') !== 0) {
                    return;
                }
                this.processFolder(result, keyRing);
                const cipher = this.initLoginCipher();
                cipher.name = value.display_name.replace('http://', '').replace('https://', '');
                if (cipher.name.length > 30) {
                    cipher.name = cipher.name.substring(0, 30);
                }
                cipher.login.password = this.getValueOrDefault(value.secret);
                cipher.login.uris = this.makeUriArray(value.display_name);
                if (value.attributes != null) {
                    cipher.login.username = value.attributes != null ?
                        this.getValueOrDefault(value.attributes.username_value) : null;
                    for (const attr in value.attributes) {
                        if (!value.attributes.hasOwnProperty(attr) || attr === 'username_value' ||
                            attr === 'xdg:schema') {
                            continue;
                        }
                        this.processKvp(cipher, attr, value.attributes[attr]);
                    }
                }
                this.convertToNoteIfNeeded(cipher);
                this.cleanupCipher(cipher);
                result.ciphers.push(cipher);
            });
        }
        if (this.organization) {
            this.moveFoldersToCollections(result);
        }
        result.success = true;
        return result;
    }
}
exports.GnomeJsonImporter = GnomeJsonImporter;
//# sourceMappingURL=gnomeJsonImporter.js.map