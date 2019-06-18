import { BaseResponse } from './baseResponse';
import { PaymentMethodType } from '../../enums/paymentMethodType';
import { TransactionType } from '../../enums/transactionType';
export declare class BillingResponse extends BaseResponse {
    balance: number;
    paymentSource: BillingSourceResponse;
    invoices: BillingInvoiceResponse[];
    transactions: BillingTransactionResponse[];
    constructor(response: any);
}
export declare class BillingSourceResponse extends BaseResponse {
    type: PaymentMethodType;
    cardBrand: string;
    description: string;
    needsVerification: boolean;
    constructor(response: any);
}
export declare class BillingInvoiceResponse extends BaseResponse {
    url: string;
    pdfUrl: string;
    number: string;
    paid: boolean;
    date: string;
    amount: number;
    constructor(response: any);
}
export declare class BillingTransactionResponse extends BaseResponse {
    createdDate: string;
    amount: number;
    refunded: boolean;
    partiallyRefunded: boolean;
    refundedAmount: number;
    type: TransactionType;
    paymentMethodType: PaymentMethodType;
    details: string;
    constructor(response: any);
}
