"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class KeysResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.privateKey = this.getResponseProperty('PrivateKey');
        this.publicKey = this.getResponseProperty('PublicKey');
    }
}
exports.KeysResponse = KeysResponse;
//# sourceMappingURL=keysResponse.js.map