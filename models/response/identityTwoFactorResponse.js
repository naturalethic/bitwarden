"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class IdentityTwoFactorResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.twoFactorProviders2 = new Map();
        this.twoFactorProviders = this.getResponseProperty('TwoFactorProviders');
        const twoFactorProviders2 = this.getResponseProperty('TwoFactorProviders2');
        if (twoFactorProviders2 != null) {
            for (const prop in twoFactorProviders2) {
                if (twoFactorProviders2.hasOwnProperty(prop)) {
                    this.twoFactorProviders2.set(parseInt(prop, null), twoFactorProviders2[prop]);
                }
            }
        }
    }
}
exports.IdentityTwoFactorResponse = IdentityTwoFactorResponse;
//# sourceMappingURL=identityTwoFactorResponse.js.map