"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const folderView_1 = require("../models/view/folderView");
const secureNoteView_1 = require("../models/view/secureNoteView");
const cipherType_1 = require("../enums/cipherType");
const secureNoteType_1 = require("../enums/secureNoteType");
class SafeInCloudXmlImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        const doc = this.parseXml(data);
        if (doc == null) {
            result.success = false;
            return result;
        }
        const db = doc.querySelector('database');
        if (db == null) {
            result.errorMessage = 'Missing `database` node.';
            result.success = false;
            return result;
        }
        const foldersMap = new Map();
        Array.from(doc.querySelectorAll('database > label')).forEach((labelEl) => {
            const name = labelEl.getAttribute('name');
            const id = labelEl.getAttribute('id');
            if (!this.isNullOrWhitespace(name) && !this.isNullOrWhitespace(id)) {
                foldersMap.set(id, result.folders.length);
                const folder = new folderView_1.FolderView();
                folder.name = name;
                result.folders.push(folder);
            }
        });
        Array.from(doc.querySelectorAll('database > card')).forEach((cardEl) => {
            if (cardEl.getAttribute('template') === 'true') {
                return;
            }
            const labelIdEl = this.querySelectorDirectChild(cardEl, 'label_id');
            if (labelIdEl != null) {
                const labelId = labelIdEl.textContent;
                if (!this.isNullOrWhitespace(labelId) && foldersMap.has(labelId)) {
                    result.folderRelationships.push([result.ciphers.length, foldersMap.get(labelId)]);
                }
            }
            const cipher = this.initLoginCipher();
            cipher.name = this.getValueOrDefault(cardEl.getAttribute('title'), '--');
            const cardType = cardEl.getAttribute('type');
            if (cardType === 'note') {
                cipher.type = cipherType_1.CipherType.SecureNote;
                cipher.secureNote = new secureNoteView_1.SecureNoteView();
                cipher.secureNote.type = secureNoteType_1.SecureNoteType.Generic;
            }
            else {
                Array.from(this.querySelectorAllDirectChild(cardEl, 'field')).forEach((fieldEl) => {
                    const text = fieldEl.textContent;
                    if (this.isNullOrWhitespace(text)) {
                        return;
                    }
                    const name = fieldEl.getAttribute('name');
                    const fieldType = this.getValueOrDefault(fieldEl.getAttribute('type'), '').toLowerCase();
                    if (fieldType === 'login') {
                        cipher.login.username = text;
                    }
                    else if (fieldType === 'password') {
                        cipher.login.password = text;
                    }
                    else if (fieldType === 'notes') {
                        cipher.notes += (text + '\n');
                    }
                    else if (fieldType === 'weblogin' || fieldType === 'website') {
                        cipher.login.uris = this.makeUriArray(text);
                    }
                    else {
                        this.processKvp(cipher, name, text);
                    }
                });
            }
            Array.from(this.querySelectorAllDirectChild(cardEl, 'notes')).forEach((notesEl) => {
                cipher.notes += (notesEl.textContent + '\n');
            });
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
exports.SafeInCloudXmlImporter = SafeInCloudXmlImporter;
//# sourceMappingURL=safeInCloudXmlImporter.js.map