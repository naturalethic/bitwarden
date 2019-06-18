"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collectionView_1 = require("../view/collectionView");
const domainBase_1 = require("./domainBase");
class Collection extends domainBase_1.default {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            id: null,
            organizationId: null,
            name: null,
            externalId: null,
            readOnly: null,
        }, alreadyEncrypted, ['id', 'organizationId', 'externalId', 'readOnly']);
    }
    decrypt() {
        return this.decryptObj(new collectionView_1.CollectionView(this), {
            name: null,
        }, this.organizationId);
    }
}
exports.Collection = Collection;
//# sourceMappingURL=collection.js.map