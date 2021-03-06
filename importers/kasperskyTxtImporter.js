"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const NotesHeader = 'Notes\n\n';
const ApplicationsHeader = 'Applications\n\n';
const WebsitesHeader = 'Websites\n\n';
const Delimiter = '\n---\n';
class KasperskyTxtImporter extends baseImporter_1.BaseImporter {
    parse(data) {
        const result = new importResult_1.ImportResult();
        let notesData;
        let applicationsData;
        let websitesData;
        let workingData = this.splitNewLine(data).join('\n');
        if (workingData.indexOf(NotesHeader) !== -1) {
            const parts = workingData.split(NotesHeader);
            if (parts.length > 1) {
                workingData = parts[0];
                notesData = parts[1];
            }
        }
        if (workingData.indexOf(ApplicationsHeader) !== -1) {
            const parts = workingData.split(ApplicationsHeader);
            if (parts.length > 1) {
                workingData = parts[0];
                applicationsData = parts[1];
            }
        }
        if (workingData.indexOf(WebsitesHeader) === 0) {
            const parts = workingData.split(WebsitesHeader);
            if (parts.length > 1) {
                workingData = parts[0];
                websitesData = parts[1];
            }
        }
        const notes = this.parseDataCategory(notesData);
        const applications = this.parseDataCategory(applicationsData);
        const websites = this.parseDataCategory(websitesData);
        notes.forEach((n) => {
            const cipher = this.initLoginCipher();
            cipher.name = this.getValueOrDefault(n.get('Name'));
            cipher.notes = this.getValueOrDefault(n.get('Text'));
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        websites.concat(applications).forEach((w) => {
            const cipher = this.initLoginCipher();
            const nameKey = w.has('Website name') ? 'Website name' : 'Application';
            cipher.name = this.getValueOrDefault(w.get(nameKey), '');
            if (!this.isNullOrWhitespace(w.get('Login name'))) {
                if (!this.isNullOrWhitespace(cipher.name)) {
                    cipher.name += ': ';
                }
                cipher.name += w.get('Login name');
            }
            cipher.notes = this.getValueOrDefault(w.get('Comment'));
            if (w.has('Website URL')) {
                cipher.login.uris = this.makeUriArray(w.get('Website URL'));
            }
            cipher.login.username = this.getValueOrDefault(w.get('Login'));
            cipher.login.password = this.getValueOrDefault(w.get('Password'));
            this.cleanupCipher(cipher);
            result.ciphers.push(cipher);
        });
        result.success = true;
        return result;
    }
    parseDataCategory(data) {
        if (this.isNullOrWhitespace(data) || data.indexOf(Delimiter) === -1) {
            return [];
        }
        const items = [];
        data.split(Delimiter).forEach((p) => {
            if (p.indexOf('\n') === -1) {
                return;
            }
            const item = new Map();
            let itemComment;
            let itemCommentKey;
            p.split('\n').forEach((l) => {
                if (itemComment != null) {
                    itemComment += ('\n' + l);
                    return;
                }
                const colonIndex = l.indexOf(':');
                let key;
                let val;
                if (colonIndex === -1) {
                    return;
                }
                else {
                    key = l.substring(0, colonIndex);
                    if (l.length > colonIndex + 1) {
                        val = l.substring(colonIndex + 2);
                    }
                }
                if (key != null) {
                    item.set(key, val);
                }
                if (key === 'Comment' || key === 'Text') {
                    itemComment = val;
                    itemCommentKey = key;
                }
            });
            if (itemComment != null && itemCommentKey != null) {
                item.set(itemCommentKey, itemComment);
            }
            if (item.size === 0) {
                return;
            }
            items.push(item);
        });
        return items;
    }
}
exports.KasperskyTxtImporter = KasperskyTxtImporter;
//# sourceMappingURL=kasperskyTxtImporter.js.map