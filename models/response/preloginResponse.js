"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class PreloginResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.kdf = this.getResponseProperty('Kdf');
        this.kdfIterations = this.getResponseProperty('KdfIterations');
    }
}
exports.PreloginResponse = PreloginResponse;
//# sourceMappingURL=preloginResponse.js.map