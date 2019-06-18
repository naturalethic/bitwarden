"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
const selectionReadOnlyResponse_1 = require("./selectionReadOnlyResponse");
class GroupResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty('Id');
        this.organizationId = this.getResponseProperty('OrganizationId');
        this.name = this.getResponseProperty('Name');
        this.accessAll = this.getResponseProperty('AccessAll');
        this.externalId = this.getResponseProperty('ExternalId');
    }
}
exports.GroupResponse = GroupResponse;
class GroupDetailsResponse extends GroupResponse {
    constructor(response) {
        super(response);
        this.collections = [];
        const collections = this.getResponseProperty('Collections');
        if (collections != null) {
            this.collections = collections.map((c) => new selectionReadOnlyResponse_1.SelectionReadOnlyResponse(c));
        }
    }
}
exports.GroupDetailsResponse = GroupDetailsResponse;
//# sourceMappingURL=groupResponse.js.map