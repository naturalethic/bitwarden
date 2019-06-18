"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
const globalDomainResponse_1 = require("./globalDomainResponse");
class DomainsResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.globalEquivalentDomains = [];
        this.equivalentDomains = this.getResponseProperty('EquivalentDomains');
        const globalEquivalentDomains = this.getResponseProperty('GlobalEquivalentDomains');
        if (globalEquivalentDomains != null) {
            this.globalEquivalentDomains = globalEquivalentDomains.map((d) => new globalDomainResponse_1.GlobalDomainResponse(d));
        }
        else {
            this.globalEquivalentDomains = [];
        }
    }
}
exports.DomainsResponse = DomainsResponse;
//# sourceMappingURL=domainsResponse.js.map