"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class ListResponse extends baseResponse_1.BaseResponse {
    constructor(response, t) {
        super(response);
        const data = this.getResponseProperty('Data');
        this.data = data == null ? [] : data.map((dr) => new t(dr));
        this.continuationToken = this.getResponseProperty('ContinuationToken');
    }
}
exports.ListResponse = ListResponse;
//# sourceMappingURL=listResponse.js.map