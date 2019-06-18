import { BaseResponse } from './baseResponse';
export declare class SubscriptionResponse extends BaseResponse {
    storageName: string;
    storageGb: number;
    maxStorageGb: number;
    subscription: BillingSubscriptionResponse;
    upcomingInvoice: BillingSubscriptionUpcomingInvoiceResponse;
    license: any;
    expiration: string;
    constructor(response: any);
}
export declare class BillingSubscriptionResponse extends BaseResponse {
    trialStartDate: string;
    trialEndDate: string;
    periodStartDate: string;
    periodEndDate: string;
    cancelledDate: string;
    cancelAtEndDate: boolean;
    status: string;
    cancelled: boolean;
    items: BillingSubscriptionItemResponse[];
    constructor(response: any);
}
export declare class BillingSubscriptionItemResponse extends BaseResponse {
    name: string;
    amount: number;
    quantity: number;
    interval: string;
    constructor(response: any);
}
export declare class BillingSubscriptionUpcomingInvoiceResponse extends BaseResponse {
    date: string;
    amount: number;
    constructor(response: any);
}
