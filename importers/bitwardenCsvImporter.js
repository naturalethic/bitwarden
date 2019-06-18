"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const cipherView_1 = require("../models/view/cipherView");
const collectionView_1 = require("../models/view/collectionView");
const fieldView_1 = require("../models/view/fieldView");
const loginView_1 = require("../models/view/loginView");
const secureNoteView_1 = require("../models/view/secureNoteView");
const cipherType_1 = require("../enums/cipherType");
const fieldType_1 = require("../enums/fieldType");
const secureNoteType_1 = require("../enums/secureNoteType");
class BitwardenCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, true);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            if (this.organization && !this.isNullOrWhitespace(value.collections)) {
                const collections = value.collections.split(',');
                collections.forEach((col) => {
                    let addCollection = true;
                    let collectionIndex = result.collections.length;
                    for (let i = 0; i < result.collections.length; i++) {
                        if (result.collections[i].name === col) {
                            addCollection = false;
                            collectionIndex = i;
                            break;
                        }
                    }
                    if (addCollection) {
                        const collection = new collectionView_1.CollectionView();
                        collection.name = col;
                        result.collections.push(collection);
                    }
                    result.collectionRelationships.push([result.ciphers.length, collectionIndex]);
                });
            }
            else if (!this.organization) {
                this.processFolder(result, value.folder);
            }
            const cipher = new cipherView_1.CipherView();
            cipher.favorite = !this.organization && this.getValueOrDefault(value.favorite, '0') !== '0' ? true : false;
            cipher.type = cipherType_1.CipherType.Login;
            cipher.notes = this.getValueOrDefault(value.notes);
            cipher.name = this.getValueOrDefault(value.name, '--');
            if (!this.isNullOrWhitespace(value.fields)) {
                const fields = this.splitNewLine(value.fields);
                for (let i = 0; i < fields.length; i++) {
                    if (this.isNullOrWhitespace(fields[i])) {
                        continue;
                    }
                    const delimPosition = fields[i].lastIndexOf(': ');
                    if (delimPosition === -1) {
                        continue;
                    }
                    if (cipher.fields == null) {
                        cipher.fields = [];
                    }
                    const field = new fieldView_1.FieldView();
                    field.name = fields[i].substr(0, delimPosition);
                    field.value = null;
                    field.type = fieldType_1.FieldType.Text;
                    if (fields[i].length > (delimPosition + 2)) {
                        field.value = fields[i].substr(delimPosition + 2);
                    }
                    cipher.fields.push(field);
                }
            }
            const valueType = value.type != null ? value.type.toLowerCase() : null;
            switch (valueType) {
                case 'note':
                    cipher.type = cipherType_1.CipherType.SecureNote;
                    cipher.secureNote = new secureNoteView_1.SecureNoteView();
                    cipher.secureNote.type = secureNoteType_1.SecureNoteType.Generic;
                    break;
                default:
                    cipher.type = cipherType_1.CipherType.Login;
                    cipher.login = new loginView_1.LoginView();
                    cipher.login.totp = this.getValueOrDefault(value.login_totp || value.totp);
                    cipher.login.username = this.getValueOrDefault(value.login_username || value.username);
                    cipher.login.password = this.getValueOrDefault(value.login_password || value.password);
                    const uris = this.parseSingleRowCsv(value.login_uri || value.uri);
                    cipher.login.uris = this.makeUriArray(uris);
                    break;
            }
            result.ciphers.push(cipher);
        });
        result.success = true;
        return result;
    }
}
exports.BitwardenCsvImporter = BitwardenCsvImporter;
//# sourceMappingURL=bitwardenCsvImporter.js.map