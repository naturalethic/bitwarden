"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoginUriData {
    constructor(data) {
        this.match = null;
        if (data == null) {
            return;
        }
        this.uri = data.uri;
        this.match = data.match;
    }
}
exports.LoginUriData = LoginUriData;
//# sourceMappingURL=loginUriData.js.map