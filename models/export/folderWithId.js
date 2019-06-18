"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const folder_1 = require("./folder");
class FolderWithId extends folder_1.Folder {
    // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
    build(o) {
        this.id = o.id;
        super.build(o);
    }
}
exports.FolderWithId = FolderWithId;
//# sourceMappingURL=folderWithId.js.map