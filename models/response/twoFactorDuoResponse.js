"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class TwoFactorDuoResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.enabled = this.getResponseProperty('Enabled');
        this.host = this.getResponseProperty('Host');
        this.secretKey = this.getResponseProperty('SecretKey');
        this.integrationKey = this.getResponseProperty('IntegrationKey');
    }
}
exports.TwoFactorDuoResponse = TwoFactorDuoResponse;
//# sourceMappingURL=twoFactorDuoResponse.js.map