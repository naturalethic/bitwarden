"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class ProfileOrganizationResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty('Id');
        this.name = this.getResponseProperty('Name');
        this.useGroups = this.getResponseProperty('UseGroups');
        this.useDirectory = this.getResponseProperty('UseDirectory');
        this.useEvents = this.getResponseProperty('UseEvents');
        this.useTotp = this.getResponseProperty('UseTotp');
        this.use2fa = this.getResponseProperty('Use2fa');
        this.useApi = this.getResponseProperty('UseApi');
        this.selfHost = this.getResponseProperty('SelfHost');
        this.usersGetPremium = this.getResponseProperty('UsersGetPremium');
        this.seats = this.getResponseProperty('Seats');
        this.maxCollections = this.getResponseProperty('MaxCollections');
        this.maxStorageGb = this.getResponseProperty('MaxStorageGb');
        this.key = this.getResponseProperty('Key');
        this.status = this.getResponseProperty('Status');
        this.type = this.getResponseProperty('Type');
        this.enabled = this.getResponseProperty('Enabled');
    }
}
exports.ProfileOrganizationResponse = ProfileOrganizationResponse;
//# sourceMappingURL=profileOrganizationResponse.js.map