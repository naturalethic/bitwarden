"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const collectionView_1 = require("../models/view/collectionView");
class PasspackCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, true);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            const tagsJson = !this.isNullOrWhitespace(value.Tags) ? JSON.parse(value.Tags) : null;
            const tags = tagsJson != null && tagsJson.tags != null && tagsJson.tags.length > 0 ?
                tagsJson.tags.map((tagJson) => {
                    try {
                        const t = JSON.parse(tagJson);
                        return this.getValueOrDefault(t.tag);
                    }
                    catch (_a) { }
                    return null;
                }).filter((t) => !this.isNullOrWhitespace(t)) : null;
            if (this.organization && tags != null && tags.length > 0) {
                tags.forEach((tag) => {
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
            else if (!this.organization && tags != null && tags.length > 0) {
                this.processFolder(result, tags[0]);
            }
            const cipher = this.initLoginCipher();
            cipher.notes = this.getValueOrDefault(value.Notes, '');
            cipher.notes += ('\n\n' + this.getValueOrDefault(value['Shared Notes'], '') + '\n');
            cipher.name = this.getValueOrDefault(value['Entry Name'], '--');
            cipher.login.username = this.getValueOrDefault(value['User ID']);
            cipher.login.password = this.getValueOrDefault(value.Password);
            cipher.login.uris = this.makeUriArray(value.URL);
            if (value.__parsed_extra != null && value.__parsed_extra.length > 0) {
                value.__parsed_extra.forEach((extra) => {
                    if (!this.isNullOrWhitespace(extra)) {
                        cipher.notes += ('\n' + extra);
                    }
                });
            }
            const fieldsJson = !this.isNullOrWhitespace(value['Extra Fields']) ?
                JSON.parse(value['Extra Fields']) : null;
            const fields = fieldsJson != null && fieldsJson.extraFields != null &&
                fieldsJson.extraFields.length > 0 ? fieldsJson.extraFields.map((fieldJson) => {
                try {
                    return JSON.parse(fieldJson);
                }
                catch (_a) { }
                return null;
            }) : null;
            if (fields != null) {
                fields.forEach((f) => {
                    if (f != null) {
                        this.processKvp(cipher, f.name, f.data);
                    }
                });
            }
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        result.success = true;
        return result;
    }
}
exports.PasspackCsvImporter = PasspackCsvImporter;
//# sourceMappingURL=passpackCsvImporter.js.map