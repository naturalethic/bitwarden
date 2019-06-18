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
const folderData_1 = require("../models/data/folderData");
const folder_1 = require("../models/domain/folder");
const folderRequest_1 = require("../models/request/folderRequest");
const folderView_1 = require("../models/view/folderView");
const serviceUtils_1 = require("../misc/serviceUtils");
const utils_1 = require("../misc/utils");
const Keys = {
    foldersPrefix: 'folders_',
    ciphersPrefix: 'ciphers_',
};
const NestingDelimiter = '/';
class FolderService {
    constructor(cryptoService, userService, apiService, storageService, i18nService, cipherService) {
        this.cryptoService = cryptoService;
        this.userService = userService;
        this.apiService = apiService;
        this.storageService = storageService;
        this.i18nService = i18nService;
        this.cipherService = cipherService;
    }
    clearCache() {
        this.decryptedFolderCache = null;
    }
    encrypt(model, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = new folder_1.Folder();
            folder.id = model.id;
            folder.name = yield this.cryptoService.encrypt(model.name, key);
            return folder;
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const folders = yield this.storageService.get(Keys.foldersPrefix + userId);
            if (folders == null || !folders.hasOwnProperty(id)) {
                return null;
            }
            return new folder_1.Folder(folders[id]);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const folders = yield this.storageService.get(Keys.foldersPrefix + userId);
            const response = [];
            for (const id in folders) {
                if (folders.hasOwnProperty(id)) {
                    response.push(new folder_1.Folder(folders[id]));
                }
            }
            return response;
        });
    }
    getAllDecrypted() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.decryptedFolderCache != null) {
                return this.decryptedFolderCache;
            }
            const hasKey = yield this.cryptoService.hasKey();
            if (!hasKey) {
                throw new Error('No key.');
            }
            const decFolders = [];
            const promises = [];
            const folders = yield this.getAll();
            folders.forEach((folder) => {
                promises.push(folder.decrypt().then((f) => decFolders.push(f)));
            });
            yield Promise.all(promises);
            decFolders.sort(utils_1.Utils.getSortFunction(this.i18nService, 'name'));
            const noneFolder = new folderView_1.FolderView();
            noneFolder.name = this.i18nService.t('noneFolder');
            decFolders.push(noneFolder);
            this.decryptedFolderCache = decFolders;
            return this.decryptedFolderCache;
        });
    }
    getAllNested() {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = yield this.getAllDecrypted();
            const nodes = [];
            folders.forEach((f) => {
                const folderCopy = new folderView_1.FolderView();
                folderCopy.id = f.id;
                folderCopy.revisionDate = f.revisionDate;
                const parts = f.name != null ? f.name.replace(/^\/+|\/+$/g, '').split(NestingDelimiter) : [];
                serviceUtils_1.ServiceUtils.nestedTraverse(nodes, 0, parts, folderCopy, null, NestingDelimiter);
            });
            return nodes;
        });
    }
    getNested(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = yield this.getAllNested();
            return serviceUtils_1.ServiceUtils.getTreeNodeObject(folders, id);
        });
    }
    saveWithServer(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new folderRequest_1.FolderRequest(folder);
            let response;
            if (folder.id == null) {
                response = yield this.apiService.postFolder(request);
                folder.id = response.id;
            }
            else {
                response = yield this.apiService.putFolder(folder.id, request);
            }
            const userId = yield this.userService.getUserId();
            const data = new folderData_1.FolderData(response, userId);
            yield this.upsert(data);
        });
    }
    upsert(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            let folders = yield this.storageService.get(Keys.foldersPrefix + userId);
            if (folders == null) {
                folders = {};
            }
            if (folder instanceof folderData_1.FolderData) {
                const f = folder;
                folders[f.id] = f;
            }
            else {
                folder.forEach((f) => {
                    folders[f.id] = f;
                });
            }
            yield this.storageService.save(Keys.foldersPrefix + userId, folders);
            this.decryptedFolderCache = null;
        });
    }
    replace(folders) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            yield this.storageService.save(Keys.foldersPrefix + userId, folders);
            this.decryptedFolderCache = null;
        });
    }
    clear(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.remove(Keys.foldersPrefix + userId);
            this.decryptedFolderCache = null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const folders = yield this.storageService.get(Keys.foldersPrefix + userId);
            if (folders == null) {
                return;
            }
            if (typeof id === 'string') {
                if (folders[id] == null) {
                    return;
                }
                delete folders[id];
            }
            else {
                id.forEach((i) => {
                    delete folders[i];
                });
            }
            yield this.storageService.save(Keys.foldersPrefix + userId, folders);
            this.decryptedFolderCache = null;
            // Items in a deleted folder are re-assigned to "No Folder"
            const ciphers = yield this.storageService.get(Keys.ciphersPrefix + userId);
            if (ciphers != null) {
                const updates = [];
                for (const cId in ciphers) {
                    if (ciphers[cId].folderId === id) {
                        ciphers[cId].folderId = null;
                        updates.push(ciphers[cId]);
                    }
                }
                if (updates.length > 0) {
                    this.cipherService.upsert(updates);
                }
            }
        });
    }
    deleteWithServer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.deleteFolder(id);
            yield this.delete(id);
        });
    }
}
exports.FolderService = FolderService;
//# sourceMappingURL=folder.service.js.map