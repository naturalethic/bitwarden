"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class DeviceResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty('Id');
        this.name = this.getResponseProperty('Name');
        this.identifier = this.getResponseProperty('Identifier');
        this.type = this.getResponseProperty('Type');
        this.creationDate = this.getResponseProperty('CreationDate');
    }
}
exports.DeviceResponse = DeviceResponse;
//# sourceMappingURL=deviceResponse.js.map