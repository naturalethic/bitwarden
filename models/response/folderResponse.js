"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
class FolderResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty('Id');
        this.name = this.getResponseProperty('Name');
        this.revisionDate = this.getResponseProperty('RevisionDate');
    }
}
exports.FolderResponse = FolderResponse;
//# sourceMappingURL=folderResponse.js.map