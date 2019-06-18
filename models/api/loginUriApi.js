"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("../response/baseResponse");
class LoginUriApi extends baseResponse_1.BaseResponse {
    constructor(data = null) {
        super(data);
        this.match = null;
        if (data == null) {
            return;
        }
        this.uri = this.getResponseProperty('Uri');
        const match = this.getResponseProperty('Match');
        this.match = match != null ? match : null;
    }
}
exports.LoginUriApi = LoginUriApi;
//# sourceMappingURL=loginUriApi.js.map