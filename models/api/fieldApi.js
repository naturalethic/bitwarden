"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("../response/baseResponse");
class FieldApi extends baseResponse_1.BaseResponse {
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.type = this.getResponseProperty('Type');
        this.name = this.getResponseProperty('Name');
        this.value = this.getResponseProperty('Value');
    }
}
exports.FieldApi = FieldApi;
//# sourceMappingURL=fieldApi.js.map