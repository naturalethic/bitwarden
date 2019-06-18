"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class BreachAccountResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.addedDate = this.getResponseProperty('AddedDate');
        this.breachDate = this.getResponseProperty('BreachDate');
        this.dataClasses = this.getResponseProperty('DataClasses');
        this.description = this.getResponseProperty('Description');
        this.domain = this.getResponseProperty('Domain');
        this.isActive = this.getResponseProperty('IsActive');
        this.isVerified = this.getResponseProperty('IsVerified');
        this.logoPath = this.getResponseProperty('LogoPath');
        this.modifiedDate = this.getResponseProperty('ModifiedDate');
        this.name = this.getResponseProperty('Name');
        this.pwnCount = this.getResponseProperty('PwnCount');
        this.title = this.getResponseProperty('Title');
    }
}
exports.BreachAccountResponse = BreachAccountResponse;
//# sourceMappingURL=breachAccountResponse.js.map