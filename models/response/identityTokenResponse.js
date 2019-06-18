"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class IdentityTokenResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.accessToken = response.access_token;
        this.expiresIn = response.expires_in;
        this.refreshToken = response.refresh_token;
        this.tokenType = response.token_type;
        this.privateKey = this.getResponseProperty('PrivateKey');
        this.key = this.getResponseProperty('Key');
        this.twoFactorToken = this.getResponseProperty('TwoFactorToken');
    }
}
exports.IdentityTokenResponse = IdentityTokenResponse;
//# sourceMappingURL=identityTokenResponse.js.map