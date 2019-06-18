"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class EventResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.type = this.getResponseProperty('Type');
        this.userId = this.getResponseProperty('UserId');
        this.organizationId = this.getResponseProperty('OrganizationId');
        this.cipherId = this.getResponseProperty('CipherId');
        this.collectionId = this.getResponseProperty('CollectionId');
        this.groupId = this.getResponseProperty('GroupId');
        this.organizationUserId = this.getResponseProperty('OrganizationUserId');
        this.actingUserId = this.getResponseProperty('ActingUserId');
        this.date = this.getResponseProperty('Date');
        this.deviceType = this.getResponseProperty('DeviceType');
        this.ipAddress = this.getResponseProperty('IpAddress');
    }
}
exports.EventResponse = EventResponse;
//# sourceMappingURL=eventResponse.js.map