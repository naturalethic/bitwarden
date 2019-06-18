"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const folderRequest_1 = require("./folderRequest");
class FolderWithIdRequest extends folderRequest_1.FolderRequest {
    constructor(folder) {
        super(folder);
        this.id = folder.id;
    }
}
exports.FolderWithIdRequest = FolderWithIdRequest;
//# sourceMappingURL=folderWithIdRequest.js.map