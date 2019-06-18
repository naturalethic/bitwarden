"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class OrganizationResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty('Id');
        this.name = this.getResponseProperty('Name');
        this.businessName = this.getResponseProperty('BusinessName');
        this.businessAddress1 = this.getResponseProperty('BusinessAddress1');
        this.businessAddress2 = this.getResponseProperty('BusinessAddress2');
        this.businessAddress3 = this.getResponseProperty('BusinessAddress3');
        this.businessCountry = this.getResponseProperty('BusinessCountry');
        this.businessTaxNumber = this.getResponseProperty('BusinessTaxNumber');
        this.billingEmail = this.getResponseProperty('BillingEmail');
        this.plan = this.getResponseProperty('Plan');
        this.planType = this.getResponseProperty('PlanType');
        this.seats = this.getResponseProperty('Seats');
        this.maxCollections = this.getResponseProperty('MaxCollections');
        this.maxStorageGb = this.getResponseProperty('MaxStorageGb');
        this.useGroups = this.getResponseProperty('UseGroups');
        this.useDirectory = this.getResponseProperty('UseDirectory');
        this.useEvents = this.getResponseProperty('UseEvents');
        this.useTotp = this.getResponseProperty('UseTotp');
        this.use2fa = this.getResponseProperty('Use2fa');
        this.useApi = this.getResponseProperty('UseApi');
    }
}
exports.OrganizationResponse = OrganizationResponse;
//# sourceMappingURL=organizationResponse.js.map