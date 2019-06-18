"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class GlobalDomainResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.type = this.getResponseProperty('Type');
        this.domains = this.getResponseProperty('Domains');
        this.excluded = this.getResponseProperty('Excluded');
    }
}
exports.GlobalDomainResponse = GlobalDomainResponse;
//# sourceMappingURL=globalDomainResponse.js.map