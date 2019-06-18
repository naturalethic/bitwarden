"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class ApiKeyResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.apiKey = this.getResponseProperty('ApiKey');
    }
}
exports.ApiKeyResponse = ApiKeyResponse;
//# sourceMappingURL=apiKeyResponse.js.map