"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const collectionView_1 = require("../models/view/collectionView");
class PadlockCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, false);
        if (results == null) {
            result.success = false;
            return result;
        }
        let headers = null;
        results.forEach((value) => {
            if (headers == null) {
                headers = value.map((v) => v);
                return;
            }
            if (value.length < 2 || value.length !== headers.length) {
                return;
            }
            if (!this.isNullOrWhitespace(value[1])) {
                if (this.organization) {
                    const tags = value[1].split(',');
                    tags.forEach((tag) => {
                        tag = tag.trim();
                        let addCollection = true;
                        let collectionIndex = result.collections.length;
                        for (let i = 0; i < result.collections.length; i++) {
                            if (result.collections[i].name === tag) {
                                addCollection = false;
                                collectionIndex = i;
                                break;
                            }
                        }
                        if (addCollection) {
                            const collection = new collectionView_1.CollectionView();
                            collection.name = tag;
                            result.collections.push(collection);
                        }
                        result.collectionRelationships.push([result.ciphers.length, collectionIndex]);
                    });
                }
                else {
                    const tags = value[1].split(',');
                    const tag = tags.length > 0 ? tags[0].trim() : null;
                    this.processFolder(result, tag);
                }
            }
            const cipher = this.initLoginCipher();
            cipher.name = this.getValueOrDefault(value[0], '--');
            for (let i = 2; i < value.length; i++) {
                const header = headers[i].trim().toLowerCase();
                if (this.isNullOrWhitespace(value[i]) || this.isNullOrWhitespace(header)) {
                    continue;
                }
                if (this.usernameFieldNames.indexOf(header) > -1) {
                    cipher.login.username = value[i];
                }
                else if (this.passwordFieldNames.indexOf(header) > -1) {
                    cipher.login.password = value[i];
                }
                else if (this.uriFieldNames.indexOf(header) > -1) {
                    cipher.login.uris = this.makeUriArray(value[i]);
                }
                else {
                    this.processKvp(cipher, headers[i], value[i]);
                }
            }
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        result.success = true;
        return result;
    }
}
exports.PadlockCsvImporter = PadlockCsvImporter;
//# sourceMappingURL=padlockCsvImporter.js.map