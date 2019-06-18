"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PasswordHistoryData {
    constructor(response) {
        if (response == null) {
            return;
        }
        this.password = response.password;
        this.lastUsedDate = response.lastUsedDate;
    }
}
exports.PasswordHistoryData = PasswordHistoryData;
//# sourceMappingURL=passwordHistoryData.js.map