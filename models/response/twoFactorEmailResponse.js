"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class TwoFactorEmailResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.enabled = this.getResponseProperty('Enabled');
        this.email = this.getResponseProperty('Email');
    }
}
exports.TwoFactorEmailResponse = TwoFactorEmailResponse;
//# sourceMappingURL=twoFactorEmailResponse.js.map