"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passwordVerificationRequest_1 = require("./passwordVerificationRequest");
class TwoFactorEmailRequest extends passwordVerificationRequest_1.PasswordVerificationRequest {
    constructor(email, masterPasswordHash) {
        super();
        this.masterPasswordHash = masterPasswordHash;
        this.email = email;
    }
}
exports.TwoFactorEmailRequest = TwoFactorEmailRequest;
//# sourceMappingURL=twoFactorEmailRequest.js.map