"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FolderData {
    constructor(response, userId) {
        this.userId = userId;
        this.name = response.name;
        this.id = response.id;
        this.revisionDate = response.revisionDate;
    }
}
exports.FolderData = FolderData;
//# sourceMappingURL=folderData.js.map