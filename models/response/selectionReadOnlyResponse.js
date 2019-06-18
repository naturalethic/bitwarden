"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class SelectionReadOnlyResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty('Id');
        this.readOnly = this.getResponseProperty('ReadOnly');
    }
}
exports.SelectionReadOnlyResponse = SelectionReadOnlyResponse;
//# sourceMappingURL=selectionReadOnlyResponse.js.map