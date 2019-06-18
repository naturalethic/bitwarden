"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FieldData {
    constructor(response) {
        if (response == null) {
            return;
        }
        this.type = response.type;
        this.name = response.name;
        this.value = response.value;
    }
}
exports.FieldData = FieldData;
//# sourceMappingURL=fieldData.js.map