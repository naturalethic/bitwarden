"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
const profileOrganizationResponse_1 = require("./profileOrganizationResponse");
class ProfileResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.organizations = [];
        this.id = this.getResponseProperty('Id');
        this.name = this.getResponseProperty('Name');
        this.email = this.getResponseProperty('Email');
        this.emailVerified = this.getResponseProperty('EmailVerified');
        this.masterPasswordHint = this.getResponseProperty('MasterPasswordHint');
        this.premium = this.getResponseProperty('Premium');
        this.culture = this.getResponseProperty('Culture');
        this.twoFactorEnabled = this.getResponseProperty('TwoFactorEnabled');
        this.key = this.getResponseProperty('Key');
        this.privateKey = this.getResponseProperty('PrivateKey');
        this.securityStamp = this.getResponseProperty('SecurityStamp');
        const organizations = this.getResponseProperty('Organizations');
        if (organizations != null) {
            this.organizations = organizations.map((o) => new profileOrganizationResponse_1.ProfileOrganizationResponse(o));
        }
    }
}
exports.ProfileResponse = ProfileResponse;
//# sourceMappingURL=profileResponse.js.map