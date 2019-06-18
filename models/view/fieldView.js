"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FieldView {
    constructor(f) {
        this.name = null;
        this.value = null;
        this.type = null;
        if (!f) {
            return;
        }
        this.type = f.type;
    }
    get maskedValue() {
        return this.value != null ? '••••••••' : null;
    }
}
exports.FieldView = FieldView;
//# sourceMappingURL=fieldView.js.map