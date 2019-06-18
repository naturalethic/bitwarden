"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AttachmentView {
    constructor(a) {
        this.id = null;
        this.url = null;
        this.size = null;
        this.sizeName = null;
        this.fileName = null;
        this.key = null;
        if (!a) {
            return;
        }
        this.id = a.id;
        this.url = a.url;
        this.size = a.size;
        this.sizeName = a.sizeName;
    }
    get fileSize() {
        try {
            if (this.size != null) {
                return parseInt(this.size, null);
            }
        }
        catch (_a) { }
        return 0;
    }
}
exports.AttachmentView = AttachmentView;
//# sourceMappingURL=attachmentView.js.map