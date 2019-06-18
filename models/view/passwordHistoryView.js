"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PasswordHistoryView {
    constructor(ph) {
        this.password = null;
        this.lastUsedDate = null;
        if (!ph) {
            return;
        }
        this.lastUsedDate = ph.lastUsedDate;
    }
}
exports.PasswordHistoryView = PasswordHistoryView;
//# sourceMappingURL=passwordHistoryView.js.map