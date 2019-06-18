"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class TwoFactorRecoverResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.code = this.getResponseProperty('Code');
    }
}
exports.TwoFactorRecoverResponse = TwoFactorRecoverResponse;
//# sourceMappingURL=twoFactorRescoverResponse.js.map