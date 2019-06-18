"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class TwoFactorAuthenticatorResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.enabled = this.getResponseProperty('Enabled');
        this.key = this.getResponseProperty('Key');
    }
}
exports.TwoFactorAuthenticatorResponse = TwoFactorAuthenticatorResponse;
//# sourceMappingURL=twoFactorAuthenticatorResponse.js.map