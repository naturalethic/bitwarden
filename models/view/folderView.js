"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FolderView {
    constructor(f) {
        this.id = null;
        this.name = null;
        this.revisionDate = null;
        if (!f) {
            return;
        }
        this.id = f.id;
        this.revisionDate = f.revisionDate;
    }
}
exports.FolderView = FolderView;
//# sourceMappingURL=folderView.js.map