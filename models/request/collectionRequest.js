"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CollectionRequest {
    constructor(collection) {
        this.groups = [];
        if (collection == null) {
            return;
        }
        this.name = collection.name ? collection.name.encryptedString : null;
        this.externalId = collection.externalId;
    }
}
exports.CollectionRequest = CollectionRequest;
//# sourceMappingURL=collectionRequest.js.map