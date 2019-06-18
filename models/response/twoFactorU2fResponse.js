"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class TwoFactorU2fResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.enabled = this.getResponseProperty('Enabled');
        const keys = this.getResponseProperty('Keys');
        this.keys = keys == null ? null : keys.map((k) => new KeyResponse(k));
    }
}
exports.TwoFactorU2fResponse = TwoFactorU2fResponse;
class KeyResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.name = this.getResponseProperty('Name');
        this.id = this.getResponseProperty('Id');
        this.compromised = this.getResponseProperty('Compromised');
    }
}
exports.KeyResponse = KeyResponse;
class ChallengeResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.userId = this.getResponseProperty('UserId');
        this.appId = this.getResponseProperty('AppId');
        this.challenge = this.getResponseProperty('Challenge');
        this.version = this.getResponseProperty('Version');
    }
}
exports.ChallengeResponse = ChallengeResponse;
//# sourceMappingURL=twoFactorU2fResponse.js.map