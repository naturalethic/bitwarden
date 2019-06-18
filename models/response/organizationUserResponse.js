"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
const selectionReadOnlyResponse_1 = require("./selectionReadOnlyResponse");
class OrganizationUserResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty('Id');
        this.userId = this.getResponseProperty('UserId');
        this.type = this.getResponseProperty('Type');
        this.status = this.getResponseProperty('Status');
        this.accessAll = this.getResponseProperty('AccessAll');
    }
}
exports.OrganizationUserResponse = OrganizationUserResponse;
class OrganizationUserUserDetailsResponse extends OrganizationUserResponse {
    constructor(response) {
        super(response);
        this.name = this.getResponseProperty('Name');
        this.email = this.getResponseProperty('Email');
        this.twoFactorEnabled = this.getResponseProperty('TwoFactorEnabled');
    }
}
exports.OrganizationUserUserDetailsResponse = OrganizationUserUserDetailsResponse;
class OrganizationUserDetailsResponse extends OrganizationUserResponse {
    constructor(response) {
        super(response);
        this.collections = [];
        const collections = this.getResponseProperty('Collections');
        if (collections != null) {
            this.collections = collections.map((c) => new selectionReadOnlyResponse_1.SelectionReadOnlyResponse(c));
        }
    }
}
exports.OrganizationUserDetailsResponse = OrganizationUserDetailsResponse;
//# sourceMappingURL=organizationUserResponse.js.map