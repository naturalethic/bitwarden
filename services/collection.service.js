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
const collectionData_1 = require("../models/data/collectionData");
const collection_1 = require("../models/domain/collection");
const collectionView_1 = require("../models/view/collectionView");
const serviceUtils_1 = require("../misc/serviceUtils");
const utils_1 = require("../misc/utils");
const Keys = {
    collectionsPrefix: 'collections_',
};
const NestingDelimiter = '/';
class CollectionService {
    constructor(cryptoService, userService, storageService, i18nService) {
        this.cryptoService = cryptoService;
        this.userService = userService;
        this.storageService = storageService;
        this.i18nService = i18nService;
    }
    clearCache() {
        this.decryptedCollectionCache = null;
    }
    encrypt(model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (model.organizationId == null) {
                throw new Error('Collection has no organization id.');
            }
            const key = yield this.cryptoService.getOrgKey(model.organizationId);
            if (key == null) {
                throw new Error('No key for this collection\'s organization.');
            }
            const collection = new collection_1.Collection();
            collection.id = model.id;
            collection.organizationId = model.organizationId;
            collection.readOnly = model.readOnly;
            collection.name = yield this.cryptoService.encrypt(model.name, key);
            return collection;
        });
    }
    decryptMany(collections) {
        return __awaiter(this, void 0, void 0, function* () {
            if (collections == null) {
                return [];
            }
            const decCollections = [];
            const promises = [];
            collections.forEach((collection) => {
                promises.push(collection.decrypt().then((c) => decCollections.push(c)));
            });
            yield Promise.all(promises);
            return decCollections.sort(utils_1.Utils.getSortFunction(this.i18nService, 'name'));
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const collections = yield this.storageService.get(Keys.collectionsPrefix + userId);
            if (collections == null || !collections.hasOwnProperty(id)) {
                return null;
            }
            return new collection_1.Collection(collections[id]);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const collections = yield this.storageService.get(Keys.collectionsPrefix + userId);
            const response = [];
            for (const id in collections) {
                if (collections.hasOwnProperty(id)) {
                    response.push(new collection_1.Collection(collections[id]));
                }
            }
            return response;
        });
    }
    getAllDecrypted() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.decryptedCollectionCache != null) {
                return this.decryptedCollectionCache;
            }
            const hasKey = yield this.cryptoService.hasKey();
            if (!hasKey) {
                throw new Error('No key.');
            }
            const collections = yield this.getAll();
            this.decryptedCollectionCache = yield this.decryptMany(collections);
            return this.decryptedCollectionCache;
        });
    }
    getAllNested(collections = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (collections == null) {
                collections = yield this.getAllDecrypted();
            }
            const nodes = [];
            collections.forEach((c) => {
                const collectionCopy = new collectionView_1.CollectionView();
                collectionCopy.id = c.id;
                collectionCopy.organizationId = c.organizationId;
                const parts = c.name != null ? c.name.replace(/^\/+|\/+$/g, '').split(NestingDelimiter) : [];
                serviceUtils_1.ServiceUtils.nestedTraverse(nodes, 0, parts, collectionCopy, null, NestingDelimiter);
            });
            return nodes;
        });
    }
    getNested(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const collections = yield this.getAllNested();
            return serviceUtils_1.ServiceUtils.getTreeNodeObject(collections, id);
        });
    }
    upsert(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            let collections = yield this.storageService.get(Keys.collectionsPrefix + userId);
            if (collections == null) {
                collections = {};
            }
            if (collection instanceof collectionData_1.CollectionData) {
                const c = collection;
                collections[c.id] = c;
            }
            else {
                collection.forEach((c) => {
                    collections[c.id] = c;
                });
            }
            yield this.storageService.save(Keys.collectionsPrefix + userId, collections);
            this.decryptedCollectionCache = null;
        });
    }
    replace(collections) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            yield this.storageService.save(Keys.collectionsPrefix + userId, collections);
            this.decryptedCollectionCache = null;
        });
    }
    clear(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.remove(Keys.collectionsPrefix + userId);
            this.decryptedCollectionCache = null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const collections = yield this.storageService.get(Keys.collectionsPrefix + userId);
            if (collections == null) {
                return;
            }
            if (typeof id === 'string') {
                const i = id;
                delete collections[id];
            }
            else {
                id.forEach((i) => {
                    delete collections[i];
                });
            }
            yield this.storageService.save(Keys.collectionsPrefix + userId, collections);
            this.decryptedCollectionCache = null;
        });
    }
}
exports.CollectionService = CollectionService;
//# sourceMappingURL=collection.service.js.map