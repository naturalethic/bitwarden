"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("../response/baseResponse");
const loginUriApi_1 = require("./loginUriApi");
class LoginApi extends baseResponse_1.BaseResponse {
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.username = this.getResponseProperty('Username');
        this.password = this.getResponseProperty('Password');
        this.passwordRevisionDate = this.getResponseProperty('PasswordRevisionDate');
        this.totp = this.getResponseProperty('Totp');
        const uris = this.getResponseProperty('Uris');
        if (uris != null) {
            this.uris = uris.map((u) => new loginUriApi_1.LoginUriApi(u));
        }
    }
}
exports.LoginApi = LoginApi;
//# sourceMappingURL=loginApi.js.map