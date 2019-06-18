"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class ErrorResponse extends baseResponse_1.BaseResponse {
    constructor(response, status, identityResponse) {
        super(response);
        let errorModel = null;
        if (response != null) {
            const responseErrorModel = this.getResponseProperty('ErrorModel');
            if (responseErrorModel && identityResponse) {
                errorModel = responseErrorModel;
            }
            else {
                errorModel = response;
            }
        }
        if (errorModel) {
            this.message = this.getResponseProperty('Message', errorModel);
            this.validationErrors = this.getResponseProperty('ValidationErrors', errorModel);
        }
        else {
            if (status === 429) {
                this.message = 'Rate limit exceeded. Try again later.';
            }
        }
        this.statusCode = status;
    }
    getSingleMessage() {
        if (this.validationErrors == null) {
            return this.message;
        }
        for (const key in this.validationErrors) {
            if (!this.validationErrors.hasOwnProperty(key)) {
                continue;
            }
            if (this.validationErrors[key].length) {
                return this.validationErrors[key][0];
            }
        }
        return this.message;
    }
    getAllMessages() {
        const messages = [];
        if (this.validationErrors == null) {
            return messages;
        }
        for (const key in this.validationErrors) {
            if (!this.validationErrors.hasOwnProperty(key)) {
                continue;
            }
            this.validationErrors[key].forEach((item) => {
                let prefix = '';
                if (key.indexOf('[') > -1 && key.indexOf(']') > -1) {
                    const lastSep = key.lastIndexOf('.');
                    prefix = key.substr(0, lastSep > -1 ? lastSep : key.length) + ': ';
                }
                messages.push(prefix + item);
            });
        }
        return messages;
    }
}
exports.ErrorResponse = ErrorResponse;
//# sourceMappingURL=errorResponse.js.map