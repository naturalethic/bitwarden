"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CollectionView {
    constructor(c) {
        this.id = null;
        this.organizationId = null;
        this.name = null;
        this.externalId = null;
        this.readOnly = null;
        if (!c) {
            return;
        }
        this.id = c.id;
        this.organizationId = c.organizationId;
        this.readOnly = c.readOnly;
        this.externalId = c.externalId;
    }
}
exports.CollectionView = CollectionView;
//# sourceMappingURL=collectionView.js.map