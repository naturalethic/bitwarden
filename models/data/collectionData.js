"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CollectionData {
    constructor(response) {
        this.id = response.id;
        this.organizationId = response.organizationId;
        this.name = response.name;
        this.externalId = response.externalId;
        this.readOnly = response.readOnly;
    }
}
exports.CollectionData = CollectionData;
//# sourceMappingURL=collectionData.js.map