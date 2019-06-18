"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginUriData_1 = require("./loginUriData");
class LoginData {
    constructor(data) {
        if (data == null) {
            return;
        }
        this.username = data.username;
        this.password = data.password;
        this.passwordRevisionDate = data.passwordRevisionDate;
        this.totp = data.totp;
        if (data.uris) {
            this.uris = data.uris.map((u) => new loginUriData_1.LoginUriData(u));
        }
    }
}
exports.LoginData = LoginData;
//# sourceMappingURL=loginData.js.map