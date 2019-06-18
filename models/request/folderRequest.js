"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FolderRequest {
    constructor(folder) {
        this.name = folder.name ? folder.name.encryptedString : null;
    }
}
exports.FolderRequest = FolderRequest;
//# sourceMappingURL=folderRequest.js.map