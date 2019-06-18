"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
const selectionReadOnlyResponse_1 = require("./selectionReadOnlyResponse");
class CollectionResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty('Id');
        this.organizationId = this.getResponseProperty('OrganizationId');
        this.name = this.getResponseProperty('Name');
        this.externalId = this.getResponseProperty('ExternalId');
    }
}
exports.CollectionResponse = CollectionResponse;
class CollectionDetailsResponse extends CollectionResponse {
    constructor(response) {
        super(response);
        this.readOnly = this.getResponseProperty('ReadOnly') || false;
    }
}
exports.CollectionDetailsResponse = CollectionDetailsResponse;
class CollectionGroupDetailsResponse extends CollectionResponse {
    constructor(response) {
        super(response);
        this.groups = [];
        const groups = this.getResponseProperty('Groups');
        if (groups != null) {
            this.groups = groups.map((g) => new selectionReadOnlyResponse_1.SelectionReadOnlyResponse(g));
        }
    }
}
exports.CollectionGroupDetailsResponse = CollectionGroupDetailsResponse;
//# sourceMappingURL=collectionResponse.js.map