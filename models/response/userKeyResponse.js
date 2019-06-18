"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class UserKeyResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.userId = this.getResponseProperty('UserId');
        this.publicKey = this.getResponseProperty('PublicKey');
    }
}
exports.UserKeyResponse = UserKeyResponse;
//# sourceMappingURL=userKeyResponse.js.map