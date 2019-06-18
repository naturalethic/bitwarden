"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class SubscriptionResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.storageName = this.getResponseProperty('StorageName');
        this.storageGb = this.getResponseProperty('StorageGb');
        this.maxStorageGb = this.getResponseProperty('MaxStorageGb');
        this.license = this.getResponseProperty('License');
        this.expiration = this.getResponseProperty('Expiration');
        const subscription = this.getResponseProperty('Subscription');
        const upcomingInvoice = this.getResponseProperty('UpcomingInvoice');
        this.subscription = subscription == null ? null : new BillingSubscriptionResponse(subscription);
        this.upcomingInvoice = upcomingInvoice == null ? null :
            new BillingSubscriptionUpcomingInvoiceResponse(upcomingInvoice);
    }
}
exports.SubscriptionResponse = SubscriptionResponse;
class BillingSubscriptionResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.items = [];
        this.trialEndDate = this.getResponseProperty('TrialStartDate');
        this.trialEndDate = this.getResponseProperty('TrialEndDate');
        this.periodStartDate = this.getResponseProperty('PeriodStartDate');
        this.periodEndDate = this.getResponseProperty('PeriodEndDate');
        this.cancelledDate = this.getResponseProperty('CancelledDate');
        this.cancelAtEndDate = this.getResponseProperty('CancelAtEndDate');
        this.status = this.getResponseProperty('Status');
        this.cancelled = this.getResponseProperty('Cancelled');
        const items = this.getResponseProperty('Items');
        if (items != null) {
            this.items = items.map((i) => new BillingSubscriptionItemResponse(i));
        }
    }
}
exports.BillingSubscriptionResponse = BillingSubscriptionResponse;
class BillingSubscriptionItemResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.name = this.getResponseProperty('Name');
        this.amount = this.getResponseProperty('Amount');
        this.quantity = this.getResponseProperty('Quantity');
        this.interval = this.getResponseProperty('Interval');
    }
}
exports.BillingSubscriptionItemResponse = BillingSubscriptionItemResponse;
class BillingSubscriptionUpcomingInvoiceResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.date = this.getResponseProperty('Date');
        this.amount = this.getResponseProperty('Amount');
    }
}
exports.BillingSubscriptionUpcomingInvoiceResponse = BillingSubscriptionUpcomingInvoiceResponse;
//# sourceMappingURL=subscriptionResponse.js.map