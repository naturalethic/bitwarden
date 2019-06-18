"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseImporter_1 = require("./baseImporter");
const importResult_1 = require("../models/domain/importResult");
const folderView_1 = require("../models/view/folderView");
class KeePass2XmlImporter extends baseImporter_1.BaseImporter {
    constructor() {
        super(...arguments);
        this.result = new importResult_1.ImportResult();
    }
    parse(data) {
        const doc = this.parseXml(data);
        if (doc == null) {
            this.result.success = false;
            return this.result;
        }
        const rootGroup = doc.querySelector('KeePassFile > Root > Group');
        if (rootGroup == null) {
            this.result.errorMessage = 'Missing `KeePassFile > Root > Group` node.';
            this.result.success = false;
            return this.result;
        }
        this.traverse(rootGroup, true, '');
        if (this.organization) {
            this.moveFoldersToCollections(this.result);
        }
        this.result.success = true;
        return this.result;
    }
    traverse(node, isRootNode, groupPrefixName) {
        const folderIndex = this.result.folders.length;
        let groupName = groupPrefixName;
        if (!isRootNode) {
            if (groupName !== '') {
                groupName += '/';
            }
            const nameEl = this.querySelectorDirectChild(node, 'Name');
            groupName += nameEl == null ? '-' : nameEl.textContent;
            const folder = new folderView_1.FolderView();
            folder.name = groupName;
            this.result.folders.push(folder);
        }
        this.querySelectorAllDirectChild(node, 'Entry').forEach((entry) => {
            const cipherIndex = this.result.ciphers.length;
            const cipher = this.initLoginCipher();
            this.querySelectorAllDirectChild(entry, 'String').forEach((entryString) => {
                const valueEl = this.querySelectorDirectChild(entryString, 'Value');
                const value = valueEl != null ? valueEl.textContent : null;
                if (this.isNullOrWhitespace(value)) {
                    return;
                }
                const keyEl = this.querySelectorDirectChild(entryString, 'Key');
                const key = keyEl != null ? keyEl.textContent : null;
                if (key === 'URL') {
                    cipher.login.uris = this.makeUriArray(value);
                }
                else if (key === 'UserName') {
                    cipher.login.username = value;
                }
                else if (key === 'Password') {
                    cipher.login.password = value;
                }
                else if (key === 'Title') {
                    cipher.name = value;
                }
                else if (key === 'Notes') {
                    cipher.notes += (value + '\n');
                }
                else {
                    this.processKvp(cipher, key, value);
                }
            });
            this.cleanupCipher(cipher);
            this.result.ciphers.push(cipher);
            if (!isRootNode) {
                this.result.folderRelationships.push([cipherIndex, folderIndex]);
            }
        });
        this.querySelectorAllDirectChild(node, 'Group').forEach((group) => {
            this.traverse(group, false, groupName);
        });
    }
}
exports.KeePass2XmlImporter = KeePass2XmlImporter;
//# sourceMappingURL=keepass2XmlImporter.js.map