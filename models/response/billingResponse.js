"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class BillingResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.invoices = [];
        this.transactions = [];
        this.balance = this.getResponseProperty('Balance');
        const paymentSource = this.getResponseProperty('PaymentSource');
        const transactions = this.getResponseProperty('Transactions');
        const invoices = this.getResponseProperty('Invoices');
        this.paymentSource = paymentSource == null ? null : new BillingSourceResponse(paymentSource);
        if (transactions != null) {
            this.transactions = transactions.map((t) => new BillingTransactionResponse(t));
        }
        if (invoices != null) {
            this.invoices = invoices.map((i) => new BillingInvoiceResponse(i));
        }
    }
}
exports.BillingResponse = BillingResponse;
class BillingSourceResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.type = this.getResponseProperty('Type');
        this.cardBrand = this.getResponseProperty('CardBrand');
        this.description = this.getResponseProperty('Description');
        this.needsVerification = this.getResponseProperty('NeedsVerification');
    }
}
exports.BillingSourceResponse = BillingSourceResponse;
class BillingInvoiceResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.url = this.getResponseProperty('Url');
        this.pdfUrl = this.getResponseProperty('PdfUrl');
        this.number = this.getResponseProperty('Number');
        this.paid = this.getResponseProperty('Paid');
        this.date = this.getResponseProperty('Date');
        this.amount = this.getResponseProperty('Amount');
    }
}
exports.BillingInvoiceResponse = BillingInvoiceResponse;
class BillingTransactionResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.createdDate = this.getResponseProperty('CreatedDate');
        this.amount = this.getResponseProperty('Amount');
        this.refunded = this.getResponseProperty('Refunded');
        this.partiallyRefunded = this.getResponseProperty('PartiallyRefunded');
        this.refundedAmount = this.getResponseProperty('RefundedAmount');
        this.type = this.getResponseProperty('Type');
        this.paymentMethodType = this.getResponseProperty('PaymentMethodType');
        this.details = this.getResponseProperty('Details');
    }
}
exports.BillingTransactionResponse = BillingTransactionResponse;
//# sourceMappingURL=billingResponse.js.map