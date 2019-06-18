"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeviceRequest {
    constructor(appId, platformUtilsService) {
        this.type = platformUtilsService.getDevice();
        this.name = platformUtilsService.getDeviceString();
        this.identifier = appId;
        this.pushToken = null;
    }
}
exports.DeviceRequest = DeviceRequest;
//# sourceMappingURL=deviceRequest.js.map