"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const papa = require("papaparse");
const cipherType_1 = require("../enums/cipherType");
const cipher_1 = require("../models/domain/cipher");
const collection_1 = require("../models/domain/collection");
const cipherData_1 = require("../models/data/cipherData");
const collectionData_1 = require("../models/data/collectionData");
const cipherWithIds_1 = require("../models/export/cipherWithIds");
const collectionWithId_1 = require("../models/export/collectionWithId");
const folderWithId_1 = require("../models/export/folderWithId");
class ExportService {
    constructor(folderService, cipherService, apiService) {
        this.folderService = folderService;
        this.cipherService = cipherService;
        this.apiService = apiService;
    }
    getExport(format = 'csv') {
        return __awaiter(this, void 0, void 0, function* () {
            let decFolders = [];
            let decCiphers = [];
            const promises = [];
            promises.push(this.folderService.getAllDecrypted().then((folders) => {
                decFolders = folders;
            }));
            promises.push(this.cipherService.getAllDecrypted().then((ciphers) => {
                decCiphers = ciphers;
            }));
            yield Promise.all(promises);
            if (format === 'csv') {
                const foldersMap = new Map();
                decFolders.forEach((f) => {
                    foldersMap.set(f.id, f);
                });
                const exportCiphers = [];
                decCiphers.forEach((c) => {
                    // only export logins and secure notes
                    if (c.type !== cipherType_1.CipherType.Login && c.type !== cipherType_1.CipherType.SecureNote) {
                        return;
                    }
                    if (c.organizationId != null) {
                        return;
                    }
                    const cipher = {};
                    cipher.folder = c.folderId != null && foldersMap.has(c.folderId) ?
                        foldersMap.get(c.folderId).name : null;
                    cipher.favorite = c.favorite ? 1 : null;
                    this.buildCommonCipher(cipher, c);
                    exportCiphers.push(cipher);
                });
                return papa.unparse(exportCiphers);
            }
            else {
                const jsonDoc = {
                    folders: [],
                    items: [],
                };
                decFolders.forEach((f) => {
                    if (f.id == null) {
                        return;
                    }
                    const folder = new folderWithId_1.FolderWithId();
                    folder.build(f);
                    jsonDoc.folders.push(folder);
                });
                decCiphers.forEach((c) => {
                    if (c.organizationId != null) {
                        return;
                    }
                    const cipher = new cipherWithIds_1.CipherWithIds();
                    cipher.build(c);
                    cipher.collectionIds = null;
                    jsonDoc.items.push(cipher);
                });
                return JSON.stringify(jsonDoc, null, '  ');
            }
        });
    }
    getOrganizationExport(organizationId, format = 'csv') {
        return __awaiter(this, void 0, void 0, function* () {
            const decCollections = [];
            const decCiphers = [];
            const promises = [];
            promises.push(this.apiService.getCollections(organizationId).then((collections) => {
                const collectionPromises = [];
                if (collections != null && collections.data != null && collections.data.length > 0) {
                    collections.data.forEach((c) => {
                        const collection = new collection_1.Collection(new collectionData_1.CollectionData(c));
                        collectionPromises.push(collection.decrypt().then((decCol) => {
                            decCollections.push(decCol);
                        }));
                    });
                }
                return Promise.all(collectionPromises);
            }));
            promises.push(this.apiService.getCiphersOrganization(organizationId).then((ciphers) => {
                const cipherPromises = [];
                if (ciphers != null && ciphers.data != null && ciphers.data.length > 0) {
                    ciphers.data.forEach((c) => {
                        const cipher = new cipher_1.Cipher(new cipherData_1.CipherData(c));
                        cipherPromises.push(cipher.decrypt().then((decCipher) => {
                            decCiphers.push(decCipher);
                        }));
                    });
                }
                return Promise.all(cipherPromises);
            }));
            yield Promise.all(promises);
            if (format === 'csv') {
                const collectionsMap = new Map();
                decCollections.forEach((c) => {
                    collectionsMap.set(c.id, c);
                });
                const exportCiphers = [];
                decCiphers.forEach((c) => {
                    // only export logins and secure notes
                    if (c.type !== cipherType_1.CipherType.Login && c.type !== cipherType_1.CipherType.SecureNote) {
                        return;
                    }
                    const cipher = {};
                    cipher.collections = [];
                    if (c.collectionIds != null) {
                        cipher.collections = c.collectionIds.filter((id) => collectionsMap.has(id))
                            .map((id) => collectionsMap.get(id).name);
                    }
                    this.buildCommonCipher(cipher, c);
                    exportCiphers.push(cipher);
                });
                return papa.unparse(exportCiphers);
            }
            else {
                const jsonDoc = {
                    collections: [],
                    items: [],
                };
                decCollections.forEach((c) => {
                    const collection = new collectionWithId_1.CollectionWithId();
                    collection.build(c);
                    jsonDoc.collections.push(collection);
                });
                decCiphers.forEach((c) => {
                    const cipher = new cipherWithIds_1.CipherWithIds();
                    cipher.build(c);
                    jsonDoc.items.push(cipher);
                });
                return JSON.stringify(jsonDoc, null, '  ');
            }
        });
    }
    getFileName(prefix = null, extension = 'csv') {
        const now = new Date();
        const dateString = now.getFullYear() + '' + this.padNumber(now.getMonth() + 1, 2) + '' + this.padNumber(now.getDate(), 2) +
            this.padNumber(now.getHours(), 2) + '' + this.padNumber(now.getMinutes(), 2) +
            this.padNumber(now.getSeconds(), 2);
        return 'bitwarden' + (prefix ? ('_' + prefix) : '') + '_export_' + dateString + '.' + extension;
    }
    padNumber(num, width, padCharacter = '0') {
        const numString = num.toString();
        return numString.length >= width ? numString :
            new Array(width - numString.length + 1).join(padCharacter) + numString;
    }
    buildCommonCipher(cipher, c) {
        cipher.type = null;
        cipher.name = c.name;
        cipher.notes = c.notes;
        cipher.fields = null;
        // Login props
        cipher.login_uri = null;
        cipher.login_username = null;
        cipher.login_password = null;
        cipher.login_totp = null;
        if (c.fields) {
            c.fields.forEach((f) => {
                if (!cipher.fields) {
                    cipher.fields = '';
                }
                else {
                    cipher.fields += '\n';
                }
                cipher.fields += ((f.name || '') + ': ' + f.value);
            });
        }
        switch (c.type) {
            case cipherType_1.CipherType.Login:
                cipher.type = 'login';
                cipher.login_username = c.login.username;
                cipher.login_password = c.login.password;
                cipher.login_totp = c.login.totp;
                if (c.login.uris) {
                    cipher.login_uri = [];
                    c.login.uris.forEach((u) => {
                        cipher.login_uri.push(u.uri);
                    });
                }
                break;
            case cipherType_1.CipherType.SecureNote:
                cipher.type = 'note';
                break;
            default:
                return;
        }
        return cipher;
    }
}
exports.ExportService = ExportService;
//# sourceMappingURL=export.service.js.map