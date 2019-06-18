"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("./collection");
class CollectionWithId extends collection_1.Collection {
    // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
    build(o) {
        this.id = o.id;
        super.build(o);
    }
}
exports.CollectionWithId = CollectionWithId;
//# sourceMappingURL=collectionWithId.js.map