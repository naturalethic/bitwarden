"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class TwoFactorProviderResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.enabled = this.getResponseProperty('Enabled');
        this.type = this.getResponseProperty('Type');
    }
}
exports.TwoFactorProviderResponse = TwoFactorProviderResponse;
//# sourceMappingURL=twoFactorProviderResponse.js.map