"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TokenRequest {
    constructor(email, masterPasswordHash, provider, token, remember, device) {
        this.email = email;
        this.masterPasswordHash = masterPasswordHash;
        this.token = token;
        this.provider = provider;
        this.remember = remember;
        this.device = device != null ? device : null;
    }
    toIdentityToken(clientId) {
        const obj = {
            grant_type: 'password',
            username: this.email,
            password: this.masterPasswordHash,
            scope: 'api offline_access',
            client_id: clientId,
        };
        if (this.device) {
            obj.deviceType = this.device.type;
            obj.deviceIdentifier = this.device.identifier;
            obj.deviceName = this.device.name;
            // no push tokens for browser apps yet
            // obj.devicePushToken = this.device.pushToken;
        }
        if (this.token && this.provider != null) {
            obj.twoFactorToken = this.token;
            obj.twoFactorProvider = this.provider;
            obj.twoFactorRemember = this.remember ? '1' : '0';
        }
        return obj;
    }
}
exports.TokenRequest = TokenRequest;
//# sourceMappingURL=tokenRequest.js.map