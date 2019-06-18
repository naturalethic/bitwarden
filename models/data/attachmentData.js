"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AttachmentData {
    constructor(response) {
        if (response == null) {
            return;
        }
        this.id = response.id;
        this.url = response.url;
        this.fileName = response.fileName;
        this.key = response.key;
        this.size = response.size;
        this.sizeName = response.sizeName;
    }
}
exports.AttachmentData = AttachmentData;
//# sourceMappingURL=attachmentData.js.map