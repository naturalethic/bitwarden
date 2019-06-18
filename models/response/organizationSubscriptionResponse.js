"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const organizationResponse_1 = require("./organizationResponse");
const subscriptionResponse_1 = require("./subscriptionResponse");
class OrganizationSubscriptionResponse extends organizationResponse_1.OrganizationResponse {
    constructor(response) {
        super(response);
        this.storageName = this.getResponseProperty('StorageName');
        this.storageGb = this.getResponseProperty('StorageGb');
        const subscription = this.getResponseProperty('Subscription');
        this.subscription = subscription == null ? null : new subscriptionResponse_1.BillingSubscriptionResponse(subscription);
        const upcomingInvoice = this.getResponseProperty('UpcomingInvoice');
        this.upcomingInvoice = upcomingInvoice == null ? null :
            new subscriptionResponse_1.BillingSubscriptionUpcomingInvoiceResponse(upcomingInvoice);
        this.expiration = this.getResponseProperty('Expiration');
    }
}
exports.OrganizationSubscriptionResponse = OrganizationSubscriptionResponse;
//# sourceMappingURL=organizationSubscriptionResponse.js.map