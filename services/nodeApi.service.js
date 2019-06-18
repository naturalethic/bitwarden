"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FormData = require("form-data");
const fe = require("node-fetch");
const api_service_1 = require("./api.service");
global.fetch = fe.default;
global.Request = fe.Request;
global.Response = fe.Response;
global.Headers = fe.Headers;
global.FormData = FormData;
class NodeApiService extends api_service_1.ApiService {
    constructor(tokenService, platformUtilsService, logoutCallback) {
        super(tokenService, platformUtilsService, logoutCallback);
    }
}
exports.NodeApiService = NodeApiService;
//# sourceMappingURL=nodeApi.service.js.map