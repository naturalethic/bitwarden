"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const cipherType_1 = require("../enums/cipherType");
const secureNoteType_1 = require("../enums/secureNoteType");
const secureNoteView_1 = require("../models/view/secureNoteView");
class MSecureCsvImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const results = this.parseCsv(data, false);
        if (results == null) {
            result.success = false;
            return result;
        }
        results.forEach((value) => {
            if (value.length < 3) {
                return;
            }
            const folderName = this.getValueOrDefault(value[0], 'Unassigned') !== 'Unassigned' ? value[0] : null;
            this.processFolder(result, folderName);
            const cipher = this.initLoginCipher();
            cipher.name = this.getValueOrDefault(value[2], '--');
            if (value[1] === 'Web Logins' || value[1] === 'Login') {
                cipher.login.uris = this.makeUriArray(value[4]);
                cipher.login.username = this.getValueOrDefault(value[5]);
                cipher.login.password = this.getValueOrDefault(value[6]);
                cipher.notes = !this.isNullOrWhitespace(value[3]) ? value[3].split('\\n').join('\n') : null;
            }
            else if (value.length > 3) {
                cipher.type = cipherType_1.CipherType.SecureNote;
                cipher.secureNote = new secureNoteView_1.SecureNoteView();
                cipher.secureNote.type = secureNoteType_1.SecureNoteType.Generic;
                for (let i = 3; i < value.length; i++) {
                    if (!this.isNullOrWhitespace(value[i])) {
                        cipher.notes += (value[i] + '\n');
                    }
                }
            }
            if (!this.isNullOrWhitespace(value[1]) && cipher.type !== cipherType_1.CipherType.Login) {
                cipher.name = value[1] + ': ' + cipher.name;
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
exports.MSecureCsvImporter = MSecureCsvImporter;
//# sourceMappingURL=msecureCsvImporter.js.map