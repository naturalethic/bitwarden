import { OrganizationResponse } from './organizationResponse';
import { BillingSubscriptionResponse, BillingSubscriptionUpcomingInvoiceResponse } from './subscriptionResponse';
export declare class OrganizationSubscriptionResponse extends OrganizationResponse {
    storageName: string;
    storageGb: number;
    subscription: BillingSubscriptionResponse;
    upcomingInvoice: BillingSubscriptionUpcomingInvoiceResponse;
    expiration: string;
    constructor(response: any);
}
