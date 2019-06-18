"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class PasswordHistoryResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.password = this.getResponseProperty('Password');
        this.lastUsedDate = this.getResponseProperty('LastUsedDate');
    }
}
exports.PasswordHistoryResponse = PasswordHistoryResponse;
//# sourceMappingURL=passwordHistoryResponse.js.map