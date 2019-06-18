"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../models/response");
const messageResponse_1 = require("../models/response/messageResponse");
class LogoutCommand {
    constructor(authService, i18nService, logoutCallback) {
        this.authService = authService;
        this.i18nService = i18nService;
        this.logoutCallback = logoutCallback;
    }
    run(cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.logoutCallback();
            this.authService.logOut(() => { });
            const res = new messageResponse_1.MessageResponse('You have logged out.', null);
            return response_1.Response.success(res);
        });
    }
}
exports.LogoutCommand = LogoutCommand;
//# sourceMappingURL=logout.command.js.map