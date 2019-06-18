"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collectionView_1 = require("../view/collectionView");
class Collection {
    static template() {
        const req = new Collection();
        req.organizationId = '00000000-0000-0000-0000-000000000000';
        req.name = 'Collection name';
        req.externalId = null;
        return req;
    }
    static toView(req, view = new collectionView_1.CollectionView()) {
        view.name = req.name;
        view.externalId = req.externalId;
        if (view.organizationId == null) {
            view.organizationId = req.organizationId;
        }
        return view;
    }
    // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
    build(o) {
        this.organizationId = o.organizationId;
        this.name = o.name;
        this.externalId = o.externalId;
    }
}
exports.Collection = Collection;
//# sourceMappingURL=collection.js.map